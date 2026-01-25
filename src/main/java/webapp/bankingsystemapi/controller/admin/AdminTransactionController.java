package webapp.bankingsystemapi.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import webapp.bankingsystemapi.DTO.admin.transaction.AdminTransactionFilterRequest;
import webapp.bankingsystemapi.DTO.admin.transaction.AdminTransactionResponse;
import webapp.bankingsystemapi.DTO.transaction.TransactionResponse;
import webapp.bankingsystemapi.service.TransactionService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/transaction")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTransactionController {
    private final TransactionService service;

    @GetMapping
    public ResponseEntity<Page<AdminTransactionResponse>> getAllTransaction(
            @PageableDefault(size = 20,sort = "createdAt",direction = Sort.Direction.DESC)Pageable pageable){
        return ResponseEntity.ok(service.getAllTransactions(pageable));
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<AdminTransactionResponse>> filterTransaction(@RequestBody AdminTransactionFilterRequest request,
            @PageableDefault(size = 20,sort = "createdAt",direction = Sort.Direction.DESC)Pageable pageable){
        return ResponseEntity.ok(service.filterAdminTransactions(request,pageable));
    }

    @GetMapping("{transactionId}")
    public ResponseEntity<AdminTransactionResponse> getTransaction(
            @PathVariable Long transactionId){
        return ResponseEntity.ok(service.getTransaction(transactionId));
    }



}
