package webapp.bankingsystemapi.DTO.admin.account;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import webapp.bankingsystemapi.enums.AccountStatus;

@Data
public class AccountUpdateRequest {

    @NotNull
    private Long id;

    @NotNull
    private AccountStatus status;
}
