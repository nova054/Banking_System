//package webapp.bankingsystemapi.service;
//
//import jakarta.transaction.Transactional;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ActiveProfiles;
//import webapp.bankingsystemapi.DTO.transaction.DepositRequest;
//import webapp.bankingsystemapi.DTO.transaction.TransferRequest;
//import webapp.bankingsystemapi.DTO.transaction.TransactionResponse;
//import webapp.bankingsystemapi.DTO.transaction.TransferResponse;
//import webapp.bankingsystemapi.DTO.transaction.WithdrawRequest;
//import webapp.bankingsystemapi.model.Account;
//import webapp.bankingsystemapi.model.User;
//import webapp.bankingsystemapi.repo.AccountRepo;
//import webapp.bankingsystemapi.repo.UserRepo;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//@Transactional
//@ActiveProfiles("test")
//class PositiveTransactionServiceImplTest {
//
//    @Autowired
//    private TransactionService transactionService;
//
//    @Autowired
//    private AccountRepo accountRepo;
//
//    @Autowired
//    private UserRepo userRepo;
//
//    private Account accountA;
//    private Account accountB;
//
//    @BeforeEach
//    void setUp() {
//
//        User testUser = userRepo.save(
//                User.builder()
//                        .fullName("Test User")
//                        .email("test@example.com")
//                        .password("password")
//                        .role("CUSTOMER")
//                        .build()
//        );
//
//        accountA = accountRepo.save(
//                Account.builder()
//                        .accountNumber("ACC-1001")
//                        .balance(1000.0)
//                        .type("SAVINGS")
//                        .user(testUser)
//                        .build()
//        );
//
//        accountB = accountRepo.save(
//                Account.builder()
//                        .accountNumber("ACC-1002")
//                        .balance(500.0)
//                        .type("SAVINGS")
//                        .user(testUser)
//                        .build()
//        );
//    }
//
//    // ---------------- DEPOSIT ----------------
//
//    @Test
//    void deposit_shouldIncreaseBalance() {
//
//        DepositRequest request = DepositRequest.builder()
//                .accountId(accountA.getId())
//                .amount(200.0)
//                .description("Initial deposit")
//                .build();
//
//        TransactionResponse response = transactionService.deposit(request);
//
//        Account updatedAccount = accountRepo.findById(accountA.getId()).orElseThrow();
//
//        assertEquals(1200.0, updatedAccount.getBalance());
//        assertEquals("DEPOSIT", response.getType());
//        assertEquals(200.0, response.getAmount());
//        assertNotNull(response.getReferenceNumber());
//    }
//
//    // ---------------- WITHDRAW ----------------
//
//    @Test
//    void withdraw_shouldDecreaseBalance() {
//
//        WithdrawRequest request = WithdrawRequest.builder()
//                .accountId(accountA.getId())
//                .amount(300.0)
//                .description("ATM withdrawal")
//                .build();
//
//        TransactionResponse response = transactionService.withdraw(request);
//
//        Account updatedAccount = accountRepo.findById(accountA.getId()).orElseThrow();
//
//        assertEquals(700.0, updatedAccount.getBalance());
//        assertEquals("WITHDRAW", response.getType());
//        assertEquals(300.0, response.getAmount());
//    }
//
//    // ---------------- TRANSFER ----------------
//
//    @Test
//    void transfer_shouldMoveMoneyBetweenAccounts() {
//
//        TransferRequest request = TransferRequest.builder()
//                .fromAccountId(accountA.getId())
//                .toAccountId(accountB.getId())
//                .amount(400.0)
//                .description("Rent payment")
//                .build();
//
//        TransferResponse response = transactionService.transfer(request);
//
//        Account updatedFrom = accountRepo.findById(accountA.getId()).orElseThrow();
//        Account updatedTo = accountRepo.findById(accountB.getId()).orElseThrow();
//
//        assertEquals(600.0, updatedFrom.getBalance());
//        assertEquals(900.0, updatedTo.getBalance());
//
//        assertNotNull(response.getDebitReferenceNumber());
//        assertNotNull(response.getCreditReferenceNumber());
//        assertEquals(400.0, response.getAmount());
//    }
//
//
//
//
//
//}
