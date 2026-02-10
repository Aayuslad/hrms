package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.security.CurrentUserUtil;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.ParticipantResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanSummaryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantExpenseResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.*;
import com.aayush.lad.hrms.modules.travel.enums.ExpenseStatus;
import com.aayush.lad.hrms.modules.travel.mappers.TravelPlanMapper;
import com.aayush.lad.hrms.modules.travel.models.*;
import com.aayush.lad.hrms.modules.travel.repositories.DocumentTypeRepository;
import com.aayush.lad.hrms.modules.travel.repositories.ExpenseCategoryRepository;
import com.aayush.lad.hrms.modules.travel.repositories.TravelPlanRepository;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TravelPlanService {

    private final TravelPlanRepository travelPlanRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final UserRepository userRepository;

    private final TravelPlanMapper travelPlanMapper;
    private final CurrentUserUtil currentUserUtil;

    // create
    public TravelPlanResponse create(CreateTravelPlanRequest request) {
        TravelPlan travelPlan = travelPlanMapper.toEntity(request);

        TravelPlan savedTravelPlan = travelPlanRepository.save(travelPlan);

        return travelPlanMapper.toResponse(savedTravelPlan);
    }

    // update
    public TravelPlanResponse update(UpdateTravelPlanRequest request) {
        TravelPlan travelPlan = travelPlanMapper.toEntity(request);

        TravelPlan savedTravelPlan = travelPlanRepository.save(travelPlan);

        return travelPlanMapper.toResponse(savedTravelPlan);
    }

    // get one
    public TravelPlanResponse getById(UUID id) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithAll(id).orElse(null);

        if (travelPlan == null) {
            throw new NotFoundException("Travel plan not found");
        }

        return travelPlanMapper.toResponse(travelPlan);
    }

    // get all
    public List<TravelPlanSummaryResponse> getAll() {
        List<TravelPlan> travelPlans = travelPlanRepository.findAll();

        return travelPlanMapper.toSumaryResponseList(travelPlans);
    }

    // delete
    public void delete(UUID id) {
        if (!travelPlanRepository.existsById(id)) {
            throw new NotFoundException("Travel plan not found");
        }
        // TODO: soft delete
        travelPlanRepository.deleteById(id);
    }

    // ### participant related functions from here on

    public ParticipantResponse getTravelParticipant(UUID travelPlanId, UUID participantId) {
        User participant = userRepository.findById(participantId).orElse(null);

        if (participant == null)
            throw new NotFoundException("Participant not found");

        List<TravelPlanExpense> expenses = travelPlanRepository
                .findTravelPlanExpensesByIdAndParticipantId(travelPlanId, participantId);

        List<TravelPlanDocument> documents = travelPlanRepository
                .findTravelPlanDocumentsByIdAndParticipantId(travelPlanId, participantId);

        ParticipantResponse response = new ParticipantResponse();
        response.setId(participantId);
        response.setUserName(participant.getUserName());
        response.setDocuments(travelPlanMapper.toDocumentResponseList(documents));
        response.setExpenses(travelPlanMapper.toExpenseResponseList(expenses));

        return response;
    }

    // create expense (used by participant)
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

        TravelPlanExpense expense = travelPlanMapper.toExpenseEntity(request, travelPlan, participant, category);

        travelPlan.getExpenses().add(expense);
        travelPlanRepository.save(travelPlan);
    }

    // update expense (used by participant)
    public ParticipantExpenseResponse updateExpense(UpdateExpenseRequest request) {
        TravelPlan travelPlan = travelPlanRepository.findByExpenseId(request.getId());
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

        // replace proofs
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

        return travelPlanMapper.toExpenseResponseList(List.of(target)).get(0);
    }

    // delete expense (used by participant)
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

    public ParticipantExpenseResponse submitExpense(UUID travelPlanId, UUID participantId, UUID expenseId) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithAll(travelPlanId).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlanExpense target = travelPlan.getExpenses().stream()
                .filter(e -> e.getId().equals(expenseId) && e.getParticipant() != null &&
                        e.getParticipant().getId().equals(participantId))
                .findFirst().orElse(null);

        if (target == null)
            throw new NotFoundException("Expense not found");

        target.setStatus(ExpenseStatus.SUBMITTED);
        target.setSubmittedAt(LocalDateTime.now());

        travelPlanRepository.save(travelPlan);

        return travelPlanMapper.toExpenseResponseList(List.of(target)).get(0);
    }

    public ParticipantExpenseResponse approveExpense(UUID travelPlanId, UUID participantId, UUID expenseId) {
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

        return travelPlanMapper.toExpenseResponseList(List.of(target)).get(0);
    }

    public void rejectExpense(UUID travelPlanId, UUID participantId, UUID expenseId) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithAll(travelPlanId).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlanExpense target = travelPlan.getExpenses().stream()
                .filter(e -> e.getId().equals(expenseId))
                .findFirst().orElse(null);

        if (target == null)
            throw new NotFoundException("Expense not found");

        target.setStatus(ExpenseStatus.REJECTED);

        travelPlanRepository.save(travelPlan);
    }

    // ## document functions
    public void createDocument(CreateTravelPlanDocumentRequest request) {
        TravelPlan travelPlan = travelPlanRepository.findById(request.getTravelPlanId()).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        User owner = userRepository.findById(request.getOwnerId()).orElse(null);
        if (owner == null)
            throw new NotFoundException("Owner not found");

        DocumentType dt = documentTypeRepository.findById(request.getDocumentTypeId()).orElse(null);
        if (dt == null)
            throw new NotFoundException("Document type not found");

        String username = currentUserUtil.getUsername();
        User uploadedBy = userRepository.findByUserName(username).orElse(null);

        TravelPlanDocument doc = travelPlanMapper.toDocumentEntity(request, travelPlan, owner, dt, uploadedBy);

        travelPlan.getTravelPlanDocuments().add(doc);
        travelPlanRepository.save(travelPlan);
    }

    public void updateDocument(UpdateTravelPlanDocumentRequest request) {
        TravelPlan travelPlan = travelPlanRepository.findByDocumentId(request.getId());
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlanDocument target = travelPlan.getTravelPlanDocuments().stream()
                .filter(d -> d.getId().equals(request.getId()))
                .findFirst().orElse(null);
        if (target == null)
            throw new NotFoundException("Document not found");

        User owner = userRepository.findById(request.getOwnerId()).orElse(null);
        if (owner == null)
            throw new NotFoundException("Owner not found");

        DocumentType dt = documentTypeRepository.findById(request.getDocumentTypeId()).orElse(null);
        if (dt == null)
            throw new NotFoundException("Document type not found");

        target.setOwner(owner);
        target.setDocumentType(dt);

        travelPlanRepository.save(travelPlan);
    }

    public void deleteDocument(UUID travelPlanId, UUID participantId, UUID documentId) {
        TravelPlan travelPlan = travelPlanRepository.findById(travelPlanId).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        boolean removed = travelPlan.getTravelPlanDocuments()
                .removeIf(d ->
                        d.getId().equals(documentId) &&
                                d.getOwner() != null && d.getOwner().getId().equals(participantId)
                );

        if (!removed)
            throw new NotFoundException("Document not found");

        travelPlanRepository.save(travelPlan);
    }
}
