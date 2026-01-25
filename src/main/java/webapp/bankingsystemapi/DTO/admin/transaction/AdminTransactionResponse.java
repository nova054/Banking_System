package webapp.bankingsystemapi.DTO.admin.transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.bankingsystemapi.enums.TransactionStatus;
import webapp.bankingsystemapi.enums.TransactionType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminTransactionResponse {
    private Long id;
    private String referenceNumber;
    private TransactionType type;
    private Double amount;
    private TransactionStatus status;
    private Double beforeBalance;
    private Double afterBalance;
    private String description;
    private LocalDateTime createdAt;
    private String accountNumber;
    private String transferId;
}
