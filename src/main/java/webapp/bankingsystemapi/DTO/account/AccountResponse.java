package webapp.bankingsystemapi.DTO.account;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountResponse implements AccountView{
    private String accountNumber;
    private String type;
    private Double balance;
    private LocalDateTime createdAt;
}
