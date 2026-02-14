package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;


import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.aayush.lad.hrms.modules.travel.enums.ExpenseStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
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

    private List<MultipartFile> proofs;
}
