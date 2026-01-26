package webapp.bankingsystemapi.validation;


import org.springframework.stereotype.Component;
import webapp.bankingsystemapi.enums.UserStatus;
import webapp.bankingsystemapi.model.User;

@Component
public class UserValidator {

    public void validateActive(User user){
        if(!user.isActive()){
            System.out.println("User is not active");
        }
        if(!user.getStatus().equals(UserStatus.ACTIVE)){
            System.out.println("User is not active");
        }
    }

}
