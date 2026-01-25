package webapp.bankingsystemapi.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;
import webapp.bankingsystemapi.model.AuditLog;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepo extends JpaRepository<AuditLog, Long> {


    @Query("""
        SELECT a FROM AuditLog a
        WHERE (:userEmail IS NULL OR a.performedBy = :userEmail)
          AND (:action IS NULL OR a.audit = :action)
          AND (:entityType IS NULL OR a.entityType = :entityType)
          AND (:fromDate IS NULL OR a.createdAt >= :fromDate)
          AND (:toDate IS NULL OR a.createdAt <= :toDate)
    """)
    Page<AuditLog> filterAudits(
            @Param("userEmail") String userEmail,
            @Param("action") AuditAction action,
            @Param("entityType") AuditEntityType entityType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

}
