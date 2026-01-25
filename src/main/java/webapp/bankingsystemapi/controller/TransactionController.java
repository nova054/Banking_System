package webapp.bankingsystemapi.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import webapp.bankingsystemapi.DTO.transaction.*;
import webapp.bankingsystemapi.service.TransactionService;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService service;

    @PostMapping("/deposit")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<TransactionResponse> deposit(
            @Valid @RequestBody DepositRequest request, Authentication authentication) {
        String email = authentication.getName();

        TransactionResponse response = service.deposit(request, email);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/withdraw")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<TransactionResponse> withdraw(
            @Valid @RequestBody WithdrawRequest request, Authentication authentication) {

        String email = authentication.getName();
        TransactionResponse response = service.withdraw(request, email);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<TransferResponse> transfer(
            @Valid @RequestBody TransferRequest request,Authentication authentication) {

        String email = authentication.getName();
        TransferResponse response = service.transfer(request, email);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/statement")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TransactionResponse>> getStatement(
            @Valid @RequestBody StatementRequest request,
            Authentication authentication,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )Pageable pageable
    ) {
        String email = authentication.getName();

        Page<TransactionResponse> response = service.getStatement(request, email, pageable);

        return ResponseEntity.ok(response);
    }




}
