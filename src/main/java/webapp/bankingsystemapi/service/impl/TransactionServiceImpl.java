package webapp.bankingsystemapi.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import webapp.bankingsystemapi.DTO.admin.transaction.AdminTransactionFilterRequest;
import webapp.bankingsystemapi.DTO.admin.transaction.AdminTransactionResponse;
import webapp.bankingsystemapi.DTO.transaction.*;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;
import webapp.bankingsystemapi.enums.TransactionStatus;
import webapp.bankingsystemapi.enums.TransactionType;
import webapp.bankingsystemapi.exception.AccessDeniedException;
import webapp.bankingsystemapi.exception.BadRequestException;
import webapp.bankingsystemapi.exception.ResourceNotFoundException;
import webapp.bankingsystemapi.model.Account;
import webapp.bankingsystemapi.model.Transaction;
import webapp.bankingsystemapi.repo.AccountRepo;
import webapp.bankingsystemapi.repo.TransactionRepo;
import webapp.bankingsystemapi.service.AuditService;
import webapp.bankingsystemapi.service.TransactionService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final AccountRepo accountRepo;
    private final TransactionRepo transactionRepo;
    private final AuditService auditService;


    @Override
    public Page<TransactionResponse> getStatement(StatementRequest request, String email, Pageable pageable){
        Account account = findByAccountNumber(request.getAccountNumber());

        if (!hasAdminRole()) {
            validateAccountOwnership(account, email);
        }
        if (request.getFromDate() != null && request.getToDate() != null && request.getFromDate().isAfter(request.getToDate())) {
            throw new BadRequestException("From date cannot be after To date");
        }
        LocalDateTime fromDateTime = request.getFromDate() != null 
            ? request.getFromDate().atStartOfDay() 
            : null;
        LocalDateTime toDateTime = request.getToDate() != null 
            ? request.getToDate().atTime(23, 59, 59) 
            : null;

        return transactionRepo
                .filterStatements(
                        request.getAccountNumber(),
                        fromDateTime,
                        toDateTime,
                        request.getMinAmount(),
                        request.getMaxAmount(), pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest request,String email) {
            Account account = findByAccountNumber(request.getAccountNumber());

            Transaction transaction = Transaction.builder()
                    .account(account)
                    .amount(request.getAmount())
                    .beforeAmount(account.getBalance())
                    .remainingAmount(account.getBalance())
                    .description(request.getDescription())
                    .status(TransactionStatus.INITIATED)
                    .referenceNumber(UUID.randomUUID().toString())
                    .type(TransactionType.DEPOSIT)
                    .build();

            transactionRepo.save(transaction);
            try {
                if (!hasAdminRole()) {
                    validateAccountOwnership(account, email);
                }

                if (request.getAmount() <= 0)
                    throw new BadRequestException("Deposit amount must be greater than zero.");

                Double beforeAmount = account.getBalance();
                account.setBalance(beforeAmount + request.getAmount());

                transaction.setRemainingAmount(account.getBalance());
                transaction.setStatus(TransactionStatus.SUCCESS);
                transactionRepo.save(transaction);

                auditService.logSuccess(AuditAction.DEPOSIT, AuditEntityType.TRANSACTION, transaction.getId(),
                        String.format("Deposited %.2f to account %s", request.getAmount(), account.getAccountNumber()));
//                  accountRepo.save(account);  // account loaded from db so no need to save but we need to save transaction.

                return mapToResponse(transaction);
            }catch(Exception e) {
                transaction.setStatus(TransactionStatus.FAILED);
                transactionRepo.save(transaction);
                auditService.logFailure(AuditAction.DEPOSIT, AuditEntityType.TRANSACTION, transaction.getId(), e.getMessage());
                throw e;
            }
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(WithdrawRequest withdrawRequest, String email) {
            Account account = findByAccountNumber(withdrawRequest.getAccountNumber());

            Transaction transaction = Transaction.builder()
                    .account(account)
                    .amount(withdrawRequest.getAmount())
                    .beforeAmount(account.getBalance())
                    .remainingAmount(account.getBalance())
                    .description(withdrawRequest.getDescription())
                    .status(TransactionStatus.INITIATED)
                    .referenceNumber(UUID.randomUUID().toString())
                    .type(TransactionType.WITHDRAW)
                    .build();
//        accountRepo.save(account);
            transactionRepo.save(transaction);

        try {
            if (!hasAdminRole()) {
                validateAccountOwnership(account, email);
            }

            if (withdrawRequest.getAmount() <= 0)
                throw new BadRequestException("Withdraw amount must be greater than zero.");

            if (account.getBalance() < withdrawRequest.getAmount())
                throw new BadRequestException("Insufficient balance.");

            Double beforeAmount = account.getBalance();
            account.setBalance(beforeAmount - withdrawRequest.getAmount());

            transaction.setRemainingAmount(account.getBalance());
            transaction.setStatus(TransactionStatus.SUCCESS);
            transactionRepo.save(transaction);

            auditService.logSuccess(AuditAction.WITHDRAW, AuditEntityType.TRANSACTION, transaction.getId(),
                    String.format("Withdrawn %.2f from account %s", withdrawRequest.getAmount(), account.getAccountNumber()));

            return mapToResponse(transaction);

        }catch(Exception e) {
            transaction.setStatus(TransactionStatus.FAILED);
            transactionRepo.save(transaction);

            auditService.logFailure(AuditAction.WITHDRAW, AuditEntityType.TRANSACTION, transaction.getId(), e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public TransferResponse transfer(TransferRequest transferRequest, String email) {
        String fromAccountNumber= transferRequest.getFromAccountNumber();
        String toAccountNumber= transferRequest.getToAccountNumber();

        Account fromAccount = findByAccountNumber(fromAccountNumber);
        Account toAccount = findByAccountNumber(toAccountNumber);

        if (!hasAdminRole()) {
            validateAccountOwnership(fromAccount, email);
        }

        if (transferRequest.getAmount() <= 0)
            throw new BadRequestException("Transfer amount must be greater than zero.");

        if (fromAccountNumber.equals(toAccountNumber))
            throw new BadRequestException("Transfer between the same account is not allowed.");

        if (fromAccount.getBalance() < transferRequest.getAmount())
            throw new BadRequestException("Insufficient Balance.");

        String transferId = "TRF-"  + System.currentTimeMillis() + "-" + UUID.randomUUID();

        Transaction debitTransaction = Transaction.builder()
                .account(fromAccount)
                .beforeAmount(fromAccount.getBalance())
                .remainingAmount(fromAccount.getBalance())
                .amount(transferRequest.getAmount())
                .description(transferRequest.getDescription())
                .referenceNumber(UUID.randomUUID().toString())
                .transferId(transferId)
                .status(TransactionStatus.INITIATED)
                .type(TransactionType.TRANSFER_DEBIT)
                .build();

        Transaction creditTransaction = Transaction.builder()
                .account(toAccount)
                .amount(transferRequest.getAmount())
                .beforeAmount(toAccount.getBalance())
                .remainingAmount(toAccount.getBalance())
                .description(transferRequest.getDescription())
                .referenceNumber(UUID.randomUUID().toString())
                .transferId(transferId)
                .status(TransactionStatus.INITIATED)
                .type(TransactionType.TRANSFER_CREDIT)
                .build();

//        accountRepo.save(fromAccount);
//        accountRepo.save(toAccount);
        transactionRepo.save(debitTransaction);
        transactionRepo.save(creditTransaction);

        try {

            //Pending
            debitTransaction.setStatus(TransactionStatus.PENDING);
            creditTransaction.setStatus(TransactionStatus.PENDING);
            transactionRepo.save(debitTransaction);
            transactionRepo.save(creditTransaction);

            fromAccount.setBalance(fromAccount.getBalance() - transferRequest.getAmount());
            toAccount.setBalance(toAccount.getBalance() + transferRequest.getAmount());

            //Success
            debitTransaction.setRemainingAmount(fromAccount.getBalance());
            creditTransaction.setRemainingAmount(toAccount.getBalance());
            debitTransaction.setStatus(TransactionStatus.SUCCESS);
            creditTransaction.setStatus(TransactionStatus.SUCCESS);
            transactionRepo.save(debitTransaction);
            transactionRepo.save(creditTransaction);

            auditService.logSuccess(AuditAction.TRANSFER, AuditEntityType.TRANSACTION,debitTransaction.getId(),
                    String.format("Transfer %.2f amount from account %s to %s account", transferRequest.getAmount(), fromAccount.getAccountNumber(), toAccount.getAccountNumber()));

            return TransferResponse.builder()
                    .fromAccountNumber(fromAccountNumber)
                    .toAccountNumber(toAccountNumber)
                    .beforeAmount(debitTransaction.getBeforeAmount())
                    .remainingAmount(debitTransaction.getRemainingAmount())
                    .amount(transferRequest.getAmount())
                    .description(transferRequest.getDescription())
                    .createdAt(debitTransaction.getCreatedAt())
                    .creditReferenceNumber(creditTransaction.getReferenceNumber())
                    .debitReferenceNumber(debitTransaction.getReferenceNumber())
                    .status(TransactionStatus.SUCCESS)
                    .build();

        }catch (Exception ex) {
            debitTransaction.setStatus(TransactionStatus.FAILED);
            creditTransaction.setStatus(TransactionStatus.FAILED);
            transactionRepo.save(debitTransaction);
            transactionRepo.save(creditTransaction);

            auditService.logFailure(AuditAction.TRANSFER,AuditEntityType.TRANSACTION, debitTransaction.getId(),ex.getMessage());
            throw ex;
        }
    }

//    Helper Methods

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AdminTransactionResponse getTransaction(Long transactionId) {
        Transaction transaction = transactionRepo.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id " + transactionId));
        return mapToAdminResponse(transaction);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AdminTransactionResponse> filterAdminTransactions(
            AdminTransactionFilterRequest request,
            Pageable pageable
    ) {
        Page<Transaction> page =
                transactionRepo.filterAdminTransactions(
                        request.getAccountNumber(),
                        request.getUserEmail(),
                        request.getType(),
                        request.getStatus(),
                        request.getFromDate(),
                        request.getToDate(),
                        request.getMinAmount(),
                        request.getMaxAmount(),
                        pageable
                );

        auditService.logSuccess(AuditAction.TRANSACTION_VIEW,AuditEntityType.TRANSACTION,null,"Admin viewed filtered transactions");

        return page.map(this::mapToAdminResponse);
    }

    @Override
    public Page<AdminTransactionResponse> getAllTransactions(Pageable pageable) {
        return transactionRepo.getAllTransactions(pageable).map(this::mapToAdminResponse);
    }


    private Account findByAccountNumber(String accountNumber) {
        return accountRepo
                .getAccountByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

    }
    private boolean hasAdminRole() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals("ROLE_ADMIN"));
    }

    private void validateAccountOwnership(Account account, String email) {
        if (!email.equals(account.getUser().getEmail())) {
            throw new AccessDeniedException("You are not allowed to access this account");
        }
    }


    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
//                .id(transaction.getId())
//                .accountId(transaction.getAccount().getId())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .beforeBalance(transaction.getBeforeAmount())
                .afterBalance(transaction.getRemainingAmount())
                .referenceNumber(transaction.getReferenceNumber())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
    private AdminTransactionResponse mapToAdminResponse(Transaction transaction) {
        return AdminTransactionResponse.builder()
                .id(transaction.getId())
                .accountNumber(transaction.getAccount().getAccountNumber())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .beforeBalance(transaction.getBeforeAmount())
                .afterBalance(transaction.getRemainingAmount())
                .referenceNumber(transaction.getReferenceNumber())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .transferId(transaction.getTransferId())
                .build();
    }





}
