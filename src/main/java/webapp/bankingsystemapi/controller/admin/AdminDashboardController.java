package webapp.bankingsystemapi.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import webapp.bankingsystemapi.DTO.admin.SystemOverviewResponse;
import webapp.bankingsystemapi.service.AdminAggregateService;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminAggregateService adminAggregateService;

    @GetMapping
    public ResponseEntity<SystemOverviewResponse> dashboard() {
        return ResponseEntity.ok(adminAggregateService.getSystemOverview());
    }
}

