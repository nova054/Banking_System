package webapp.bankingsystemapi.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import webapp.bankingsystemapi.DTO.admin.audit.AuditFilterRequest;
import webapp.bankingsystemapi.DTO.admin.audit.AuditLogResponse;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;
import webapp.bankingsystemapi.enums.AuditStatus;
import webapp.bankingsystemapi.model.AuditLog;
import webapp.bankingsystemapi.repo.AuditLogRepo;
import webapp.bankingsystemapi.service.AuditService;
import webapp.bankingsystemapi.util.RequestContextUtil;


@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {
    private final AuditLogRepo repo;

    @Override
    public void logSuccess(AuditAction auditAction, AuditEntityType auditEntityType, Long entityId, String description) {
        saveLog(auditAction, auditEntityType, entityId, description, AuditStatus.SUCCESS);
    }

    @Override
    public void logFailure(AuditAction auditAction, AuditEntityType auditEntityType, Long entityId, String description) {
        saveLog(auditAction, auditEntityType, entityId, description, AuditStatus.FAILED);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AuditLogResponse> getAllAudits(Pageable pageable) {
        Page<AuditLog> page = repo.findAll(pageable);

        return page.map(this::mapToResponse);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AuditLogResponse> filterAudits(AuditFilterRequest request, Pageable pageable) {

        if (request.getFromDate() != null && request.getToDate() != null && request.getFromDate().isAfter(request.getToDate())) {
            throw new IllegalArgumentException("From date cannot be after To date");
        }

        return repo
                .filterAudits(
                        request.getUserEmail(),
                        request.getAction(),
                        request.getEntityType(),
                        request.getFromDate(),
                        request.getToDate(),
                        pageable)
                .map(this::mapToResponse);
    }

    private void saveLog(AuditAction auditAction, AuditEntityType auditEntityType, Long entityId, String description, AuditStatus status) {
        Authentication auth =  SecurityContextHolder.getContext().getAuthentication();

        String email = auth != null? auth.getName() : "SYSTEM";
        String role = "SYSTEM";
        if (auth != null && auth.getAuthorities() != null) {
            role = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("UNKNOWN");
        }

        AuditLog log = AuditLog.builder()
                .audit(auditAction)
                .entityType(auditEntityType)
                .entityId(entityId)
                .description(description)
                .performedBy(email)
                .status(status)
                .ipAddress(RequestContextUtil.getIpAddress())
                .userAgent(RequestContextUtil.getUserAgent())
                .role(role)
                .build();

        repo.save(log);
    }

    private AuditLogResponse mapToResponse(AuditLog log){
        return AuditLogResponse.builder()
                .id(log.getId())
                .action(log.getAudit())
                .userEmail(log.getPerformedBy())
                .status(log.getStatus())
                .role(log.getRole())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .ipAddress(log.getIpAddress())
                .userAgent(log.getUserAgent())
                .description(log.getDescription())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
