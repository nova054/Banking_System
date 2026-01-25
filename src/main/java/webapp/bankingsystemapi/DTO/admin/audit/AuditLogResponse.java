package webapp.bankingsystemapi.DTO.admin.audit;


import lombok.Builder;
import lombok.Data;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;
import webapp.bankingsystemapi.enums.AuditStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponse
{
    private Long id;
    private String userEmail;
    private AuditAction action;
    private AuditEntityType entityType;
    private Long entityId;
    private String role;
    private String description;
    private AuditStatus status;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime createdAt;
}
