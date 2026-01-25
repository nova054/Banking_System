package webapp.bankingsystemapi.DTO.auth;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @Email(message = "Email should be valid!")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be atleast 6 characters")
    private String password;


    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be atleast 6 characters")
    private String confirmPassword;

    //If role is not provided then default: user
//    private String role="ROLE_USER";

}
