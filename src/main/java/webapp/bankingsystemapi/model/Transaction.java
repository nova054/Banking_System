package webapp.bankingsystemapi.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.bankingsystemapi.enums.TransactionStatus;
import webapp.bankingsystemapi.enums.TransactionType;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="TRANSACTIONS")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_sequence")
    @SequenceGenerator(name="transaction_sequence", sequenceName = "transaction_sequence",allocationSize = 1)
    private Long id;

//    @Column(nullable = false)
//    private String type;  //deposit/withdraw/transfer

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Double beforeAmount;

    @Column(nullable = false)
    private Double remainingAmount;

    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

//    @Column(nullable = false)
//    private String status; //sucess/failed/pending

    @Column(name="REFERENCE_NUMBER", unique = true)
    private String referenceNumber;

    @ManyToOne( fetch = FetchType.LAZY)
    @JoinColumn(name="account_id" ,nullable = false )
    @JsonBackReference("accounts-transactions")
    private Account account;

    @Column(name="CREATED_AT", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Column(name="TRANSFER_ID", nullable = true)
    private String transferId;


    //account.id
}
