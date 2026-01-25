package webapp.bankingsystemapi.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.bankingsystemapi.enums.Role;
import webapp.bankingsystemapi.enums.UserStatus;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="USERS")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_sequence")
    @SequenceGenerator(name="user_sequence", sequenceName = "user_sequence", allocationSize = 1)
    private Long id;

    @Column(name= "FULL_NAME",nullable = false)
    private String fullName;
    //unique
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;
//    private String role;//admin/customer

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name="IS_ACTIVE", nullable = false) //nullable false
    private boolean isActive=true;

    @OneToMany(fetch = FetchType.LAZY ,orphanRemoval = true,cascade = CascadeType.ALL,mappedBy = "user")
    @JsonManagedReference("user-accounts")
    private List<Account> accounts;

    @Column(name="CREATED_AT", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(name="LAST_LOGIN_AT")
    private LocalDateTime lastLoginAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }


}
