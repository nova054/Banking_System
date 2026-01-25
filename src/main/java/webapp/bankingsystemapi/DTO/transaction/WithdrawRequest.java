package webapp.bankingsystemapi.DTO.transaction;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WithdrawRequest {

    @NotNull
    private String accountNumber;

    @Positive
    private Double amount;

    private String description;


}
