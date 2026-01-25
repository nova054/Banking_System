package webapp.bankingsystemapi.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;
import webapp.bankingsystemapi.enums.AuditStatus;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="AUDIT_LOGS")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "audit_log_sequence")
    @SequenceGenerator(name="audit_log_sequence", sequenceName = "audit_log_sequence", allocationSize = 1)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name="AUDIT_ACTION" ,nullable = false)
    private AuditAction audit;

    @Enumerated(EnumType.STRING)
    @Column(name="ENTITY_TYPE",nullable = false)
    private AuditEntityType entityType;

    @Column(name="ENTITY_ID")
    private Long entityId;

    @Column(name="PERFORMED_BY",nullable = false)
    private String performedBy;

    @Column(name="USER_ROLE",nullable = false)
    private String role;

    @Column(name="IP_ADDRESS")
    private String ipAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditStatus status;

    @Column(length = 500)
    private String description;

    @Column(name="USER_AGENT" ,length = 500)
    private String userAgent;

    @Column(name="CREATED_AT",nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate(){
        this.createdAt = LocalDateTime.now();
    }
}
