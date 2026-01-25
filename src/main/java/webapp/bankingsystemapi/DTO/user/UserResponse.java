package webapp.bankingsystemapi.DTO.user;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse implements UserView{

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private LocalDateTime createdAt;
}
