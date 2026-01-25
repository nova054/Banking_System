package webapp.bankingsystemapi.controller.admin;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import webapp.bankingsystemapi.DTO.admin.audit.AuditFilterRequest;
import webapp.bankingsystemapi.DTO.admin.audit.AuditLogResponse;
import webapp.bankingsystemapi.service.AuditService;

@RestController
@RequestMapping("/api/admin/audits")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAuditController {
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<Page<AuditLogResponse>> getAllAudits(
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )Pageable pageable){
        return ResponseEntity.ok(auditService.getAllAudits(pageable));
    }


             @GetMapping("/filters")
            public ResponseEntity<Page<AuditLogResponse>> filterAudits(
                     @RequestBody AuditFilterRequest request,
                     @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            ) Pageable pageable
    ){
            return ResponseEntity.ok(auditService.filterAudits(request, pageable));
    }
}


