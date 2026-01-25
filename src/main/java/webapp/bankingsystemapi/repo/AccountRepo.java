package webapp.bankingsystemapi.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import webapp.bankingsystemapi.enums.AccountStatus;
import webapp.bankingsystemapi.enums.AccountType;
import webapp.bankingsystemapi.model.Account;
import webapp.bankingsystemapi.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepo extends JpaRepository<Account, Long> {

    @Query("Select a from Account a where a.accountNumber = :accountNumber")
    Optional<Account> getAccountByAccountNumber(@Param("accountNumber") String accountNumber);


    @Query("Select a from Account a where a.user.id = :userId")
    List<Account> getAccountsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(a) FROM Account a WHERE a.user.id = :userId")
    int countAccountsByUserId(@Param("userId") Long userId);

    @Query("SELECT a FROM Account a")
    Page<Account> getAllAccounts(Pageable pageable);

    @Query("""
    SELECT a FROM Account a
    JOIN a.user u
    WHERE (:accountNumber IS NULL OR a.accountNumber = :accountNumber)
      AND (:userEmail IS NULL OR u.email LIKE %:userEmail%)
      AND (:status IS NULL OR a.status = :status)
      AND (:type IS NULL OR a.type = :type)
      AND (:minBalance IS NULL OR a.balance >= :minBalance)
      AND (:maxBalance IS NULL OR a.balance <= :maxBalance)
""")
    Page<Account> filterAccounts(
            @Param("accountNumber") String accountNumber,
            @Param("userEmail") String userEmail,
            @Param("status") AccountStatus status,
            @Param("type") AccountType type,
            @Param("minBalance") Double minBalance,
            @Param("maxBalance") Double maxBalance,
            Pageable pageable
    );

    long count();

    @Query("SELECT COUNT(a) FROM Account a WHERE a.status = 'OPEN'")
    long countActiveAccounts();


}
