package webapp.bankingsystemapi.validation;


import org.springframework.stereotype.Component;
import webapp.bankingsystemapi.enums.UserStatus;
import webapp.bankingsystemapi.exception.UserValidationException;
import webapp.bankingsystemapi.model.User;

@Component
public class UserValidator {

    public void validateActive(User user){
        if(!user.isActive()){
            throw new UserValidationException("User account is not active: "+ user.getEmail());
        }
        if(user.getStatus() != UserStatus.ACTIVE){
            throw new UserValidationException("User account is not active: "+ user.getEmail());
        }
    }

}
