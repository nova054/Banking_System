package webapp.bankingsystemapi.DTO.admin.audit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditFilterRequest {
    private String userEmail;
    private AuditAction action;
    private  AuditEntityType entityType;
    private  LocalDateTime fromDate;
    private  LocalDateTime toDate;
}
