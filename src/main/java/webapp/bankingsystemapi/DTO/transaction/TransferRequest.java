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
public class TransferRequest {

    @NotNull
    private String fromAccountNumber;

    @NotNull
    private String toAccountNumber;

    @Positive
    @NotNull
    private Double amount;

    private String description;


}
