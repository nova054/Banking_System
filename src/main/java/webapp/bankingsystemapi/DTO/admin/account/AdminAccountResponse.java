package webapp.bankingsystemapi.DTO.admin.account;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.bankingsystemapi.DTO.account.AccountView;
import webapp.bankingsystemapi.enums.AccountStatus;
import webapp.bankingsystemapi.enums.AccountType;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminAccountResponse implements AccountView {
    private long id;
    private String accountNumber;
    private AccountType type;
    private AccountStatus status;
    private double balance;
    private long userId;
    private String email;
    private long transactionCount;
    private LocalDateTime createdAt;
}
