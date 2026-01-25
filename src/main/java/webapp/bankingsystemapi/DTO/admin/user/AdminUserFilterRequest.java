package webapp.bankingsystemapi.DTO.admin.user;

import lombok.Data;
import webapp.bankingsystemapi.enums.Role;
import webapp.bankingsystemapi.enums.UserStatus;

import java.time.LocalDateTime;

@Data
public class AdminUserFilterRequest {

    private String fullName;
    private String email;
    private Role role;
    private Boolean isActive;
    private UserStatus status;

    private LocalDateTime fromDate;
    private LocalDateTime toDate;
}
