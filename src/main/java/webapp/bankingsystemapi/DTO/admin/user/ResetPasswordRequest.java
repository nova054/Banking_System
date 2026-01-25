package webapp.bankingsystemapi.DTO.admin.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @Email(message = "Email should be valid!")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be atleast 6 characters")
    private String password;


    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be atleast 6 characters")
    private String confirmPassword;
}
