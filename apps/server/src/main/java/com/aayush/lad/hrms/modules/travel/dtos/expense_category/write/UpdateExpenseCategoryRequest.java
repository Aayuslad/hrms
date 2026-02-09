package com.aayush.lad.hrms.modules.travel.dtos.expense_category.write;

import jakarta.validation.constraints.NotBlank;
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
public class UpdateExpenseCategoryRequest {

    @NotNull(message = "Expense category ID cannot be blank")
    private UUID id;

    @NotBlank(message = "Expense category name cannot be blank")
    private String name;
}
