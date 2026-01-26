package webapp.bankingsystemapi.DTO.admin.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.bankingsystemapi.DTO.user.UserView;
import webapp.bankingsystemapi.enums.UserStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminUserResponse implements UserView {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private boolean isActive;
    private UserStatus status;
//    private int accountCount;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
}

