package webapp.bankingsystemapi.DTO.admin.account;


import lombok.Data;
import webapp.bankingsystemapi.enums.AccountStatus;
import webapp.bankingsystemapi.enums.AccountType;

@Data
public class AdminAccountFilterRequest {

    private String accountNumber;
    private String userEmail;

    private AccountStatus status;
    private AccountType type;

    private Double minBalance;
    private Double maxBalance;

}
