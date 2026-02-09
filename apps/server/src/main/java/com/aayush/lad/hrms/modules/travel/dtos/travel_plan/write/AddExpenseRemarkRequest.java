package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddExpenseRemarkRequest {

    @NotNull(message = "Expense id can not be null")
    private UUID id;

    private String remarks;
}
