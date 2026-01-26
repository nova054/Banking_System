package webapp.bankingsystemapi.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import webapp.bankingsystemapi.DTO.account.AccountCreateRequest;
import webapp.bankingsystemapi.DTO.account.AccountResponse;
import webapp.bankingsystemapi.DTO.account.AccountView;
import webapp.bankingsystemapi.DTO.admin.account.AdminAccountFilterRequest;
import webapp.bankingsystemapi.DTO.admin.account.AdminAccountResponse;
import webapp.bankingsystemapi.enums.AccountStatus;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;
import webapp.bankingsystemapi.exception.AccessDeniedException;
import webapp.bankingsystemapi.exception.ResourceNotFoundException;
import webapp.bankingsystemapi.model.Account;
import webapp.bankingsystemapi.model.User;
import webapp.bankingsystemapi.repo.AccountRepo;
import webapp.bankingsystemapi.repo.TransactionRepo;
import webapp.bankingsystemapi.repo.UserRepo;
import webapp.bankingsystemapi.service.AccountService;
import webapp.bankingsystemapi.service.AuditService;
import webapp.bankingsystemapi.util.AccountNumberGenerator;
import webapp.bankingsystemapi.validation.UserValidator;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountServiceImpl implements AccountService {

    private final AccountRepo accountRepo;
    private final AccountNumberGenerator accountNumberGenerator;
    private final UserRepo userRepo;
    private final AuditService auditService;
    private final UserValidator userValidator;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AdminAccountResponse> filterAccounts(AdminAccountFilterRequest request, Pageable pageable) {

            return accountRepo.filterAccounts(
                    request.getAccountNumber(),
                    request.getUserEmail(),
                    request.getStatus(),
                    request.getType(),
                    request.getMinBalance(),
                    request.getMaxBalance(),
                    pageable
            ).map(this::mapToAdminResponse);
    }


    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public AccountView createAccount(AccountCreateRequest request, String email) {
        User user = findByEmail(email);
        userValidator.validateActive(user);

        Account account = Account.builder()
                .accountNumber(accountNumberGenerator.generate())
                .type(request.getType())
                .status(AccountStatus.OPEN)
                .balance(0.0)
                .user(user)
                .build();

        accountRepo.save(account);

        auditService.logSuccess(AuditAction.ACCOUNT_CREATED, AuditEntityType.ACCOUNT, account.getId(), String.format("Created account %s for user %s", account.getAccountNumber(), user.getEmail()));

        if(hasAdminRole()){
            return mapToAdminResponse(account);
        }
        return mapToResponse(account);

    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<AccountView> getAccountByUser(String email) {
        User user = findByEmail(email);
        List<Account> account = accountRepo.getAccountsByUserId(user.getId());

        if(hasAdminRole()){
            return account.stream()
                    .map(this::mapToAdminResponse)
                    .map(a -> (AccountView) a)
                    .toList();
        }
        
        return account
                .stream()
                .map(this::mapToResponse)
                .map(a -> (AccountView) a)
                .toList();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AccountView getAccountById(Long accountId) {
       Account account = accountRepo.findById(accountId).
               orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        return mapToAdminResponse(account);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public AccountView getAccountByAccountNumber(String accountNumber, String email) {
        Account account = accountRepo.getAccountByAccountNumber(accountNumber)
                .orElseThrow(()-> new ResourceNotFoundException("Account not found with accountNumber: " + accountNumber));

        if (!hasAdminRole()) {
            validateAccountOwnership(account, email);
            return mapToResponse(account);
        }
        return mapToAdminResponse(account);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AdminAccountResponse> getAllAccounts(Pageable pageable) {
        return accountRepo.getAllAccounts(pageable).map(this::mapToAdminResponse);
    }

//    @Override
//    @PreAuthorize("hasRole('ADMIN')")
//    public List<Account> getAccountsByUserId(Long userId) {
//        List<Account> account = accountRepo.getAccountsByUserId(userId);
////        List<AccountResponse> accountResponses = new ArrayList<>();
////        for (Account a : account) {
////           accountResponses.add(mapToResponse(a));
////        }
////        return accountResponses;
//        if (account.isEmpty()) {
//            throw new ResourceNotFoundException(
//                    "No accounts found for user id: " + userId
//            );
//        }
//        return account
//                .stream()
//                .toList();
//
//    }


    private User findByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(()-> new ResourceNotFoundException("User not found with email: " + email));
    }

    private boolean hasAdminRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals("ROLE_ADMIN"));
    }

    private void validateAccountOwnership(Account account, String email) {
        if (email == null ||!email.equals(account.getUser().getEmail())) {
            throw new AccessDeniedException("You are not allowed to access this account");
        }
    }


    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .accountNumber(account.getAccountNumber())
                .type(account.getType().name())
                .balance(account.getBalance())
                .createdAt(account.getCreatedAt())
                .build();
    }
    private AdminAccountResponse mapToAdminResponse(Account account){
        return AdminAccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .type(account.getType())
                .status(account.getStatus())
                .balance(account.getBalance())
                .userId(account.getUser().getId())
                .email(account.getUser().getEmail())
//                .transactionCount(transactionRepo.countByAccountId(account.getId()))
                .createdAt(account.getCreatedAt())
                .build();
    }


    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void changeStatus(Long id, AccountStatus status){
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        account.setStatus(status);
        accountRepo.save(account);
        auditService.logSuccess(AuditAction.ACCOUNT_UPDATED, AuditEntityType.ACCOUNT, id, String.format("Changed status of account %s to %s", account.getAccountNumber(), status));
    }

}
