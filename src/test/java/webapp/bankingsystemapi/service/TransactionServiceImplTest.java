//package webapp.bankingsystemapi.service;
//
//import jakarta.transaction.Transactional;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ActiveProfiles;
//import webapp.bankingsystemapi.DTO.transaction.*;
//import webapp.bankingsystemapi.exception.BadRequestException;
//import webapp.bankingsystemapi.model.Account;
//import webapp.bankingsystemapi.repo.AccountRepo;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//@Transactional
//@ActiveProfiles("test")
//class TransactionServiceImplTest {
//
//    @Autowired
//    private TransactionService transactionService;
//
//    @Autowired
//    private AccountRepo accountRepo;
//
//    private Account accountA;
//    private Account accountB;
//
//    @BeforeEach
//    void setUp() {
//        accountA = accountRepo.save(
//                Account.builder()
//                        .accountNumber("ACC-1001")
//                        .balance(1000.0)
//                        .type("SAVINGS")
//                        .build()
//        );
//
//        accountB = accountRepo.save(
//                Account.builder()
//                        .accountNumber("ACC-1002")
//                        .balance(500.0)
//                        .type("SAVINGS")
//                        .build()
//        );
//    }
//
//    // ------------------ DEPOSIT NEGATIVE ------------------
//
//    @Test
//    void deposit_shouldFail_whenAmountIsZeroOrNegative() {
//        DepositRequest request = DepositRequest.builder()
//                .accountId(accountA.getId())
//                .amount((double) 0)
//                .description("Invalid deposit")
//                .build();
//
//        assertThrows(BadRequestException.class,
//                () -> transactionService.deposit(request));
//    }
//
//    // ------------------ WITHDRAW NEGATIVE ------------------
//
//    @Test
//    void withdraw_shouldFail_whenAmountIsNegative() {
//        WithdrawRequest request = WithdrawRequest.builder()
//                .accountId(accountA.getId())
//                .amount((double) -100)
//                .description("Invalid withdraw")
//                .build();
//
//        assertThrows(BadRequestException.class,
//                () -> transactionService.withdraw(request));
//    }
//
//    @Test
//    void withdraw_shouldFail_whenInsufficientBalance() {
//        WithdrawRequest request = WithdrawRequest.builder()
//                .accountId(accountA.getId())
//                .amount(5000.0)
//                .description("Overdraft attempt")
//                .build();
//
//        assertThrows(BadRequestException.class,
//                () -> transactionService.withdraw(request));
//    }
//
//    // ------------------ TRANSFER NEGATIVE ------------------
//
//    @Test
//    void transfer_shouldFail_whenAmountIsZeroOrNegative() {
//        TransferRequest request = TransferRequest.builder()
//                .fromAccountId(accountA.getId())
//                .toAccountId(accountB.getId())
//                .amount((double) 0)
//                .description("Invalid transfer")
//                .build();
//
//        assertThrows(BadRequestException.class,
//                () -> transactionService.transfer(request));
//    }
//
//    @Test
//    void transfer_shouldFail_whenSameAccount() {
//        TransferRequest request = TransferRequest.builder()
//                .fromAccountId(accountA.getId())
//                .toAccountId(accountA.getId())
//                .amount(100.0)
//                .description("Same account transfer")
//                .build();
//
//        assertThrows(BadRequestException.class,
//                () -> transactionService.transfer(request));
//    }
//
//    @Test
//    void transfer_shouldFail_whenInsufficientBalance() {
//        TransferRequest request = TransferRequest.builder()
//                .fromAccountId(accountA.getId())
//                .toAccountId(accountB.getId())
//                .amount(5000.0)
//                .description("Insufficient balance transfer")
//                .build();
//
//        assertThrows(BadRequestException.class,
//                () -> transactionService.transfer(request));
//    }
//}
