package webapp.bankingsystemapi.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.bankingsystemapi.enums.AccountStatus;
import webapp.bankingsystemapi.enums.AccountType;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // helps build objects easily
@Table(name="ACCOUNTS") //explicitly tell the table name/optional
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_sequence")
    @SequenceGenerator(name="account_sequence", sequenceName = "account_sequence", allocationSize = 1)
    private Long id;

    @Column(name = "ACCOUNT_NUMBER",unique = true, nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountType type;  //savings/current

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.OPEN;

    @Column(nullable = false)
    private Double balance=0.0;

//    @Column(name="CREATED_AT", updatable = false)
//    private LocalDateTime createdAt= LocalDateTime.now();

    //Reln with user
    @ManyToOne(fetch = FetchType.LAZY)//only access when needed
    @JoinColumn(name="user_id", nullable = false)
    @JsonBackReference("user-accounts")
    private User user;

    //Reln with Transaction
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("accounts-transactions")
    private List<Transaction> transactions;

    @Column(name="CREATED_AT", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }



//    private int user_id;
//    private Date deleted_at;
//    private boolean isActive;

}
