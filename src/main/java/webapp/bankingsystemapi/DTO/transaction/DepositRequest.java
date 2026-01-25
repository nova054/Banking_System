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
public class DepositRequest {

    @NotNull(message = "there must be an account id")
    private String accountNumber;

    @Positive(message = "Deposit amount must be greater than zero")
    private Double amount;

    private String description;



}
