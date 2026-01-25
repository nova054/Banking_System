package webapp.bankingsystemapi.service;

import webapp.bankingsystemapi.DTO.admin.SystemOverviewResponse;


public interface AdminAggregateService {
    SystemOverviewResponse getSystemOverview();
}
