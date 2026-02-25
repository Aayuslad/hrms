package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RejectExpenseRequest {

    @NotNull
    private UUID expenseId;

    @NotNull
    private UUID travelPlanId;

    private String remarks;
}
