package webapp.bankingsystemapi.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import webapp.bankingsystemapi.enums.TransactionStatus;
import webapp.bankingsystemapi.enums.TransactionType;
import webapp.bankingsystemapi.model.Transaction;

import java.time.LocalDateTime;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Long> {


    @Query("""
    SELECT t FROM Transaction t
    WHERE t.account.accountNumber = :accountNumber
      AND (:fromDateTime IS NULL OR t.createdAt >= :fromDateTime)
      AND (:toDateTime IS NULL OR t.createdAt <= :toDateTime)
      AND (:minAmount IS NULL OR t.amount >= :minAmount)
      AND (:maxAmount IS NULL OR t.amount <= :maxAmount)
      ORDER BY t.createdAt DESC
""")
    Page<Transaction> filterStatements(
            @Param("accountNumber") String accountNumber,
            @Param("fromDateTime") LocalDateTime fromDateTime,
            @Param("toDateTime") LocalDateTime toDateTime,
            @Param("minAmount") Double minAmount,
            @Param("maxAmount") Double maxAmount,
            Pageable pageable
    );

    @Query("""
    SELECT t FROM Transaction t
    JOIN t.account a
    JOIN a.user u
    WHERE (:accountNumber IS NULL OR a.accountNumber = :accountNumber)
      AND (:userEmail IS NULL OR u.email = :userEmail)
      AND (:type IS NULL OR t.type = :type)
      AND (:status IS NULL OR t.status = :status)
      AND (:fromDate IS NULL OR t.createdAt >= :fromDate)
      AND (:toDate IS NULL OR t.createdAt <= :toDate)
      AND (:minAmount IS NULL OR t.amount >= :minAmount)
      AND (:maxAmount IS NULL OR t.amount <= :maxAmount)
""")
    Page<Transaction> filterAdminTransactions(
            String accountNumber,
            String userEmail,
            TransactionType type,
            TransactionStatus status,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Double minAmount,
            Double maxAmount,
            Pageable pageable
    );


    @Query("SELECT t FROM Transaction t")
    Page<Transaction> getAllTransactions(Pageable pageable);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.account.id = :accountId")
    int countByAccountId(@Param("accountId") Long accountId);




    @Query("""
    SELECT COUNT(t.id), COALESCE(SUM(t.amount), 0)
    FROM Transaction t
    WHERE t.status = 'SUCCESS'
      AND t.createdAt >= :start
      AND t.createdAt < :end
""")
    Object getTodayTransactionStats(
            LocalDateTime start,
            LocalDateTime end
    );


}
