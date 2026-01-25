package webapp.bankingsystemapi.DTO.admin;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder
@Data
public class SystemOverviewResponse {

    private long totalUsers;
    private long activeUsers;

    private long totalAccounts;
    private long activeAccounts;

    private long todayTransactionCount;
    private BigDecimal todayTransactionAmount;
}
