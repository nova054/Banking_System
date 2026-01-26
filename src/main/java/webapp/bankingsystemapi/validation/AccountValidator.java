package webapp.bankingsystemapi.validation;


import org.springframework.stereotype.Component;
import webapp.bankingsystemapi.enums.AccountStatus;
import webapp.bankingsystemapi.model.Account;

@Component
public class AccountValidator {
    public void validateActive(Account account){
        if(!account.getStatus().equals(AccountStatus.OPEN))
        {
            System.out.println("Account is not opened");
        }
    }
}
