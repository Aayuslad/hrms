package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;


import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddExpenseRemarkRequest {

    @NotNull(message = "Expense id can not be null")
    private UUID id;

    private String remarks;
}
