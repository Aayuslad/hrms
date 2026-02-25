package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.core.services.FileUploadService;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.ApproveExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.RejectExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateExpenseRequest;
import com.aayush.lad.hrms.modules.travel.enums.ExpenseStatus;
import com.aayush.lad.hrms.modules.travel.mappers.TravelPlanMapper;
import com.aayush.lad.hrms.modules.travel.models.ExpenseCategory;
import com.aayush.lad.hrms.modules.travel.models.TravelPlan;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanExpense;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanExpenseProof;
import com.aayush.lad.hrms.modules.travel.repositories.ExpenseCategoryRepository;
import com.aayush.lad.hrms.modules.travel.repositories.TravelPlanRepository;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TravelPlanExpenseService {

    private final TravelPlanRepository travelPlanRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final UserRepository userRepository;

    private final TravelPlanMapper travelPlanMapper;
    private final CurrentUserService currentUserService;
    private final FileUploadService fileUploadService;

    // utility helpers used by multiple endpoints
    private TravelPlan requirePlan(UUID id, boolean withAll) {
        return withAll
                ? travelPlanRepository.findByIdWithAll(id)
                        .orElseThrow(() -> new NotFoundException("Travel plan not found"))
                : travelPlanRepository.findById(id).orElseThrow(() -> new NotFoundException("Travel plan not found"));
    }

    private TravelPlanExpense requireExpense(TravelPlan plan, UUID expenseId) {
        return plan.getExpenses().stream()
                .filter(e -> e.getId().equals(expenseId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Expense not found"));
    }

    private void checkDailyExpenseLimit(TravelPlan travelPlan, User participant, LocalDate date, double amount,
            TravelPlanExpense excludeExpense) {
        double sumApproved = travelPlan.getExpenses().stream()
                .filter(e -> e.getParticipant().getId().equals(participant.getId()) && e.getDate().equals(date)
                        && e.getStatus() == ExpenseStatus.APPROVED)
                .mapToDouble(TravelPlanExpense::getAmount)
                .sum();
        double excludeAmount = (excludeExpense != null && excludeExpense.getStatus() == ExpenseStatus.APPROVED)
                ? excludeExpense.getAmount()
                : 0.0;
        if (sumApproved - excludeAmount + amount > travelPlan.getMaxExpenseAmountPerDay()) {
            throw new ConflictException("Daily expense limit exceeded");
        }
    }

    public void createExpense(CreateExpenseRequest request) {
        TravelPlan travelPlan = requirePlan(request.getTravelPlanId(), true);

        User participant = userRepository.findById(request.getParticipantId()).orElse(null);
        if (participant == null)
            throw new NotFoundException("Participant not found");

        ExpenseCategory category = expenseCategoryRepository.findById(request.getExpenseCategoryId()).orElse(null);
        if (category == null)
            throw new NotFoundException("Expense category not found");

        checkDailyExpenseLimit(travelPlan, participant, request.getDate(), request.getAmount(), null);

        TravelPlanExpense expense = travelPlanMapper.toExpenseEntity(request);

        if (request.getProofs() != null && !request.getProofs().isEmpty()) {
            List<String> profUrls = request.getProofs().stream()
                    .map(fileUploadService::uploadFile).toList();

            List<TravelPlanExpenseProof> proofs = profUrls.stream()
                    .map(x -> TravelPlanExpenseProof.builder().docUrl(x).expense(expense).build()).toList();

            expense.getProofs().clear();
            expense.getProofs().addAll(proofs);
        }

        expense.setTravelPlan(travelPlan);
        expense.setExpenseCategory(category);
        expense.setParticipant(participant);

        travelPlan.getExpenses().add(expense);
        travelPlanRepository.save(travelPlan);
    }

    public void updateExpense(UpdateExpenseRequest request) {
        TravelPlan travelPlan = requirePlan(request.getTravelPlanId(), true);
        TravelPlanExpense target = requireExpense(travelPlan, request.getId());

        checkDailyExpenseLimit(travelPlan, target.getParticipant(), request.getDate(), request.getAmount(), target);

        target.setAmount(request.getAmount());
        target.setDate(request.getDate());

        ExpenseCategory category = expenseCategoryRepository.findById(request.getExpenseCategoryId()).orElse(null);
        if (category == null)
            throw new NotFoundException("Expense category not found");

        target.setExpenseCategory(category);

        // TODO: delete the old proofs
        if (request.getProofs() != null && !request.getProofs().isEmpty()) {
            List<String> profUrls = request.getProofs().stream()
                    .map(fileUploadService::uploadFile).toList();

            List<TravelPlanExpenseProof> proofs = profUrls.stream()
                    .map(x -> TravelPlanExpenseProof.builder().docUrl(x).expense(target).build())
                    .toList();

            target.getProofs().clear();
            target.getProofs().addAll(proofs);
        }

        travelPlanRepository.save(travelPlan);
    }

    // TODO: delete the proofs from cloud as well
    public void deleteExpense(UUID travelPlanId, UUID participantId, UUID expenseId) {
        TravelPlan travelPlan = requirePlan(travelPlanId, false);

        boolean removed = travelPlan.getExpenses()
                .removeIf(e -> e.getId().equals(expenseId) && e.getParticipant() != null &&
                        e.getParticipant().getId().equals(participantId));

        if (!removed)
            throw new NotFoundException("Expense not found");

        travelPlanRepository.save(travelPlan);
    }

    public void submitExpense(UUID travelPlanId, UUID expenseId) {
        TravelPlan travelPlan = requirePlan(travelPlanId, true);
        TravelPlanExpense target = requireExpense(travelPlan, expenseId);

        checkDailyExpenseLimit(travelPlan, target.getParticipant(), target.getDate(), target.getAmount(), target);

        target.setStatus(ExpenseStatus.SUBMITTED);
        target.setSubmittedAt(LocalDateTime.now());

        travelPlanRepository.save(travelPlan);
    }

    public void approveExpense(ApproveExpenseRequest request) {
        TravelPlan travelPlan = requirePlan(request.getTravelPlanId(), true);
        TravelPlanExpense target = requireExpense(travelPlan, request.getExpenseId());

        checkDailyExpenseLimit(travelPlan, target.getParticipant(), target.getDate(), target.getAmount(), null);

        target.setStatus(ExpenseStatus.APPROVED);
        target.setApprovedBy(currentUserService.getCurrentUserEntity());
        target.setRemarks(request.getRemarks());

        travelPlanRepository.save(travelPlan);
    }

    public void rejectExpense(RejectExpenseRequest request) {
        TravelPlan travelPlan = requirePlan(request.getTravelPlanId(), true);
        TravelPlanExpense target = requireExpense(travelPlan, request.getExpenseId());

        // TODO: add who rejected here, update schema for it.
        target.setStatus(ExpenseStatus.REJECTED);
        target.setRemarks(request.getRemarks());

        travelPlanRepository.save(travelPlan);
    }
}
