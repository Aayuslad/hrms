package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal;


import com.aayush.lad.hrms.modules.travel.enums.ExpenseStatus;
import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantExpenseResponse {

    private UUID id;

    private float amount;

    private LocalDate date;

    private ExpenseStatus status;

    private String remarks;

    private LocalDateTime submittedAt;

    private ExpenseCategoryResponse expenseCategory;

    private GlobalUserResponseSummary approvedBy;

    private GlobalUserResponseSummary participant;

    private List<ExpenseProofResponse> proofs = new ArrayList<>();
}
