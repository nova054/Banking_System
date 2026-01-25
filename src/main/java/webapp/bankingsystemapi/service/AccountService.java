package webapp.bankingsystemapi.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import webapp.bankingsystemapi.DTO.account.AccountCreateRequest;
import webapp.bankingsystemapi.DTO.account.AccountView;
import webapp.bankingsystemapi.DTO.admin.account.AdminAccountFilterRequest;
import webapp.bankingsystemapi.DTO.admin.account.AdminAccountResponse;
import webapp.bankingsystemapi.enums.AccountStatus;

import java.util.List;

public interface AccountService {

    Page<AdminAccountResponse> filterAccounts(AdminAccountFilterRequest request, Pageable pageable);

    AccountView createAccount(AccountCreateRequest request, String email);

    List<AccountView> getAccountByUser(String email);

    AccountView getAccountById(Long accountId);

    AccountView getAccountByAccountNumber(String accountNumber, String email);

    Page<AdminAccountResponse> getAllAccounts(Pageable pageable);

    void changeStatus(Long id, AccountStatus status);
}