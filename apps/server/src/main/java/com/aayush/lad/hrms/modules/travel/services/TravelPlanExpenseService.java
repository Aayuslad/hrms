package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.security.CurrentUserUtil;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateExpenseRequest;
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

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TravelPlanExpenseService {

    private final TravelPlanRepository travelPlanRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final UserRepository userRepository;

    private final TravelPlanMapper travelPlanMapper;
    private final CurrentUserUtil currentUserUtil;

    public void createExpense(CreateExpenseRequest request) {
        TravelPlan travelPlan = travelPlanRepository.findById(request.getTravelPlanId()).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        User participant = userRepository.findById(request.getParticipantId()).orElse(null);
        if (participant == null)
            throw new NotFoundException("Participant not found");

        ExpenseCategory category = expenseCategoryRepository.findById(request.getExpenseCategoryId()).orElse(null);
        if (category == null)
            throw new NotFoundException("Expense category not found");

        TravelPlanExpense expense = travelPlanMapper.toExpenseEntity(request);

        expense.setTravelPlan(travelPlan);
        expense.setExpenseCategory(category);
        expense.setParticipant(participant);

        travelPlan.getExpenses().add(expense);
        travelPlanRepository.save(travelPlan);
    }

    public void updateExpense(UpdateExpenseRequest request) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithAll(request.getTravelPlanId()).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlanExpense target = null;
        for (TravelPlanExpense e : travelPlan.getExpenses()) {
            if (e.getId().equals(request.getId())) {
                target = e;
                break;
            }
        }

        if (target == null)
            throw new NotFoundException("Expense not found");

        target.setAmount(request.getAmount());
        target.setDate(request.getDate());

        ExpenseCategory category = expenseCategoryRepository.findById(request.getExpenseCategoryId()).orElse(null);
        if (category == null)
            throw new NotFoundException("Expense category not found");

        target.setExpenseCategory(category);

        target.getProofs().clear();
        if (request.getProofs() != null) {
            for (var p : request.getProofs()) {
                TravelPlanExpenseProof proof = new TravelPlanExpenseProof();

                proof.setDocUrl(p.getDocUrl());
                proof.setExpense(target);

                target.getProofs().add(proof);
            }
        }

        travelPlanRepository.save(travelPlan);
    }

    public void deleteExpense(UUID travelPlanId, UUID participantId, UUID expenseId) {
        TravelPlan travelPlan = travelPlanRepository.findById(travelPlanId).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        boolean removed = travelPlan.getExpenses()
                .removeIf(e -> e.getId().equals(expenseId) && e.getParticipant() != null &&
                        e.getParticipant().getId().equals(participantId));

        if (!removed)
            throw new NotFoundException("Expense not found");

        travelPlanRepository.save(travelPlan);
    }

    public void submitExpense(UUID travelPlanId, UUID expenseId) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithAll(travelPlanId).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlanExpense target = travelPlan.getExpenses().stream()
                .filter(e -> e.getId().equals(expenseId))
                .findFirst().orElse(null);

        if (target == null)
            throw new NotFoundException("Expense not found");

        target.setStatus(ExpenseStatus.SUBMITTED);
        target.setSubmittedAt(LocalDateTime.now());

        travelPlanRepository.save(travelPlan);
    }

    public void approveExpense(UUID travelPlanId, UUID expenseId) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithAll(travelPlanId).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlanExpense target = travelPlan.getExpenses().stream()
                .filter(e -> e.getId().equals(expenseId))
                .findFirst().orElse(null);

        if (target == null)
            throw new NotFoundException("Expense not found");

        User approver = userRepository.findByUserName(currentUserUtil.getUsername()).orElse(null);

        if (approver == null)
            throw new NotFoundException("Approver not found");

        target.setStatus(ExpenseStatus.APPROVED);
        target.setApprovedBy(approver);

        travelPlanRepository.save(travelPlan);
    }

    public void rejectExpense(UUID travelPlanId, UUID expenseId) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithAll(travelPlanId).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlanExpense target = travelPlan.getExpenses().stream()
                .filter(e -> e.getId().equals(expenseId))
                .findFirst().orElse(null);

        if (target == null)
            throw new NotFoundException("Expense not found");

        // TODO: add who rejected here, update schema for it.

        target.setStatus(ExpenseStatus.REJECTED);

        travelPlanRepository.save(travelPlan);
    }
}
