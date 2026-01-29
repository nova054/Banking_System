package webapp.bankingsystemapi.validation;


import org.springframework.stereotype.Component;
import webapp.bankingsystemapi.enums.AccountStatus;
import webapp.bankingsystemapi.exception.AccountValidationException;
import webapp.bankingsystemapi.model.Account;
import webapp.bankingsystemapi.model.User;

@Component
public class AccountValidator {
    public void validateActive(Account account) {

        if (account.getStatus() != AccountStatus.OPEN) {
            throw new AccountValidationException(
                    "Account is not active: " + account.getStatus()
            );
        }
    }

    public void validateOwnership(Account account, User user) {
        if (!account.getUser().getId().equals(user.getId())) {
            throw new AccountValidationException("Account does not belong to user");
        }
    }
}
