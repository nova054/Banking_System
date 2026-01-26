package webapp.bankingsystemapi.DTO.transaction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatementRequest {

    @NotBlank
    private String accountNumber;

    private LocalDate fromDate;
    private LocalDate toDate;

    @PositiveOrZero
    private Double minAmount;

    @PositiveOrZero
    private Double maxAmount;
}
