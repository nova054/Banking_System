package webapp.bankingsystemapi.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import webapp.bankingsystemapi.DTO.admin.SystemOverviewResponse;
import webapp.bankingsystemapi.repo.AccountRepo;
import webapp.bankingsystemapi.repo.TransactionRepo;
import webapp.bankingsystemapi.repo.UserRepo;
import webapp.bankingsystemapi.service.AdminAggregateService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminAggregateServiceImpl implements AdminAggregateService {

        private final UserRepo userRepo;
        private final AccountRepo accountRepo;
        private final TransactionRepo transactionRepo;

        public SystemOverviewResponse getSystemOverview() {

            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            LocalDateTime endOfDay = startOfDay.plusDays(1);

            Object[] txStats = (Object[]) transactionRepo.getTodayTransactionStats(startOfDay, endOfDay);

            Number txCountNumber = (Number) txStats[0];
            Number txAmountNumber = (Number) txStats[1];

            long txCount = txCountNumber.longValue();
            BigDecimal txAmount = (txAmountNumber instanceof BigDecimal ? (BigDecimal) txAmountNumber : BigDecimal.valueOf(txAmountNumber.doubleValue()));

            return SystemOverviewResponse.builder()
                    .totalUsers(userRepo.count())
                    .activeUsers(userRepo.countActiveUsers())
                    .totalAccounts(accountRepo.count())
                    .activeAccounts(accountRepo.countActiveAccounts())
                    .todayTransactionCount(txCount)
                    .todayTransactionAmount(txAmount)
                    .build();
        }

}
