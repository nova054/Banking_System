package webapp.bankingsystemapi.DTO.admin.transaction;

import lombok.Data;
import webapp.bankingsystemapi.enums.TransactionStatus;
import webapp.bankingsystemapi.enums.TransactionType;

import java.time.LocalDateTime;

@Data
public class AdminTransactionFilterRequest {

    private String accountNumber;
    private String userEmail;

    private TransactionType type;
    private TransactionStatus status;

    private LocalDateTime fromDate;
    private LocalDateTime toDate;

    private Double minAmount;
    private Double maxAmount;
}

