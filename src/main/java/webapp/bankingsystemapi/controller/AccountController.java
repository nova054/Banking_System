package webapp.bankingsystemapi.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import webapp.bankingsystemapi.DTO.account.AccountCreateRequest;
import webapp.bankingsystemapi.DTO.account.AccountResponse;
import webapp.bankingsystemapi.DTO.account.AccountView;
import webapp.bankingsystemapi.model.Account;
import webapp.bankingsystemapi.service.AccountService;

import java.util.List;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController
{
    private final AccountService accountService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<AccountView> createAccount( @Valid
            @RequestBody AccountCreateRequest accountCreateRequest , Authentication authentication){
        String email = authentication.getName();
        return new ResponseEntity<>(accountService.createAccount(accountCreateRequest, email), HttpStatus.CREATED);
    }

    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<AccountView>> getMyAccounts(
            Authentication authentication) {

        String email = authentication.getName();
        List<AccountView> accounts = accountService.getAccountByUser(email);
        return ResponseEntity.ok(accounts);
    }



    @GetMapping("/number/{accountNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<AccountView> getAccountByAccountNumber(@PathVariable String accountNumber,
                                                                     Authentication authentication) {
        String email = authentication.getName();
        return new ResponseEntity<>(accountService.getAccountByAccountNumber(accountNumber, email), HttpStatus.OK);
    }



}
