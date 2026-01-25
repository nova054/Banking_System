package webapp.bankingsystemapi.DTO.transaction;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.bankingsystemapi.enums.TransactionStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransferResponse {


//    private Long toAccountId;
//    private Long fromAccountId;
    private String toAccountNumber;
    private String fromAccountNumber;
    private String debitReferenceNumber;
    private String creditReferenceNumber;
    private Double amount;
    private Double remainingAmount;
    private Double beforeAmount;
    private TransactionStatus status;
    private String description;
    private LocalDateTime createdAt;

}
