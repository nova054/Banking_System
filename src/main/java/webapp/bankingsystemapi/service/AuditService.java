package webapp.bankingsystemapi.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import webapp.bankingsystemapi.DTO.admin.audit.AuditFilterRequest;
import webapp.bankingsystemapi.DTO.admin.audit.AuditLogResponse;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;

public interface AuditService {

    void logSuccess(AuditAction auditAction, AuditEntityType auditEntityType, Long entityId, String description );
    void logFailure(AuditAction auditAction, AuditEntityType auditEntityType, Long entityId, String description );

    Page<AuditLogResponse> getAllAudits(Pageable pageable);
    Page<AuditLogResponse> filterAudits(AuditFilterRequest request, Pageable pageable);



}
