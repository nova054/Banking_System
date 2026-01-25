package webapp.bankingsystemapi.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import webapp.bankingsystemapi.enums.Role;
import webapp.bankingsystemapi.enums.UserStatus;
import webapp.bankingsystemapi.model.User;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
//    @Query(" Select u from User u where u.email = :email")
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    @Query("""
    SELECT u FROM User u
    WHERE (:fullName IS NULL OR u.fullName LIKE %:fullName%)
      AND (:email IS NULL OR u.email LIKE %:email%)
      AND (:role IS NULL OR u.role = :role)
      AND (:status IS NULL OR u.status = :status)
      AND (:isActive IS NULL OR u.isActive = :isActive)
      AND (:fromDate IS NULL OR u.createdAt >= :fromDate)
      AND (:toDate IS NULL OR u.createdAt <= :toDate)
""")
    Page<User> filterUsers(
            @Param("fullName") String fullName,
            @Param("email") String email,
            @Param("role") Role role,
            @Param("status") UserStatus status,
            @Param("isActive") Boolean isActive,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

    long count();

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();

}
