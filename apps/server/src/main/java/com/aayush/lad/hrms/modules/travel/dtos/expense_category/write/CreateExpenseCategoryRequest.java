package com.aayush.lad.hrms.modules.travel.dtos.expense_category.write;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateExpenseCategoryRequest {

    @NotBlank(message = "Expense category name cannot be blank")
    private String name;
}
