package webapp.bankingsystemapi.service;


import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import webapp.bankingsystemapi.DTO.admin.transaction.AdminTransactionFilterRequest;
import webapp.bankingsystemapi.DTO.admin.transaction.AdminTransactionResponse;
import webapp.bankingsystemapi.DTO.transaction.*;

import java.util.List;

public interface TransactionService {

    TransactionResponse deposit(DepositRequest depositRequest,String email);
    TransactionResponse withdraw(WithdrawRequest withdrawRequest, String email);
    TransferResponse transfer(TransferRequest transferRequest, String email);
    AdminTransactionResponse getTransaction(Long transactionId);
    Page<TransactionResponse> getStatement(StatementRequest request, String email, Pageable pageable );
    Page<AdminTransactionResponse> filterAdminTransactions(AdminTransactionFilterRequest request, Pageable pageable);
    Page<AdminTransactionResponse> getAllTransactions(Pageable pageable);
}
