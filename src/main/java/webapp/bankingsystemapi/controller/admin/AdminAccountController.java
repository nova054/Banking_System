package webapp.bankingsystemapi.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import webapp.bankingsystemapi.DTO.account.AccountCreateRequest;
import webapp.bankingsystemapi.DTO.account.AccountView;
import webapp.bankingsystemapi.DTO.admin.account.AccountUpdateRequest;
import webapp.bankingsystemapi.DTO.admin.account.AdminAccountFilterRequest;
import webapp.bankingsystemapi.DTO.admin.account.AdminAccountResponse;
import webapp.bankingsystemapi.service.AccountService;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/account")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAccountController {
    private final AccountService service;

    @GetMapping("/id/{accountId}")
    public ResponseEntity<AccountView> getAccountById(@PathVariable Long accountId)
    {
        return ResponseEntity.ok(service.getAccountById(accountId));
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<AdminAccountResponse>> filterAccounts(@RequestBody AdminAccountFilterRequest request, Pageable pageable) {
        return ResponseEntity.ok(service.filterAccounts(request, pageable));
    }

    @GetMapping("/user-email")
    public ResponseEntity<List<AccountView>> getAccountsByUserEmail(@RequestParam String email) {
        return ResponseEntity.ok(service.getAccountByUser(email));
    }

    @PostMapping("/createAccount")
    public ResponseEntity<AccountView> createAccountByEmail(@RequestBody AccountCreateRequest request,@RequestParam String email){
        return new ResponseEntity<>(service.createAccount(request, email), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<AdminAccountResponse>> getAllAccounts(Pageable pageable) {
        return ResponseEntity.ok(service.getAllAccounts(pageable));
    }

    @PatchMapping("/change-status")
    public ResponseEntity<Void> changeStatus(@Valid @RequestBody AccountUpdateRequest request) {
        service.changeStatus(request.getId(), request.getStatus());
        return ResponseEntity.ok().build();
    }

}
