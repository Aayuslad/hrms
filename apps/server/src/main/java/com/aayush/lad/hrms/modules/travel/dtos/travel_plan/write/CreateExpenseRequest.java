package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;


import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.internal.ExpenseProofRequest;
import com.aayush.lad.hrms.modules.travel.enums.ExpenseStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.UUID;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateExpenseRequest {

    private UUID participantId;

    @NotNull(message = "Expense amount can not be empty")
    @Min(value = 1, message = "Price must be at least one")
    private float amount;

    private LocalDate date;

    private ExpenseStatus status = ExpenseStatus.DRAFTING;

    @NotNull(message = "Travel plan can not be null")
    private UUID travelPlanId;

    @NotNull(message = "Expense category can not be null")
    private UUID expenseCategoryId;

    private List<ExpenseProofRequest> proofs;
}
