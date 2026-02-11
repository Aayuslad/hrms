package com.aayush.lad.hrms.modules.travel.mappers;

import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanSummaryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ApproverResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ExpenseProofResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantDocumentResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantExpenseResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanDocumentRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.internal.ParticipantRequest;
import com.aayush.lad.hrms.modules.travel.models.*;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TravelPlanMapper {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    // create
    public TravelPlan toEntity(CreateTravelPlanRequest request) {
        return modelMapper.map(request, TravelPlan.class);
    }

    // update
    public TravelPlan toEntity(UpdateTravelPlanRequest request) {
        TravelPlan travelPlan = modelMapper.map(request, TravelPlan.class);

        travelPlan.getParticipants().clear();

        if (request.getParticipants() != null && !request.getParticipants().isEmpty()) {
            List<User> participants = userRepository.findAllById(
                    request.getParticipants().stream()
                            .map(ParticipantRequest::getParticipantId)
                            .toList()
            );
            travelPlan.getParticipants().addAll(participants);
        }

        return travelPlan;
    }

    public TravelPlanResponse toResponse(TravelPlan travelPlan) {
        return modelMapper.map(travelPlan, TravelPlanResponse.class);
    }

    public List<TravelPlanSummaryResponse> toSumaryResponseList(List<TravelPlan> travelPlans) {
        return travelPlans.stream()
                .map(x -> modelMapper.map(x, TravelPlanSummaryResponse.class))
                .toList();
    }

    public List<ParticipantExpenseResponse> toExpenseResponseList(List<TravelPlanExpense> expenses) {
        return expenses.stream().map(x -> {
            ParticipantExpenseResponse r = new ParticipantExpenseResponse();
            r.setId(x.getId());
            r.setAmount(x.getAmount());
            r.setDate(x.getDate());
            r.setStatus(x.getStatus());
            r.setRemarks(x.getRemarks());
            r.setSubmittedAt(x.getSubmittedAt());

            if (x.getExpenseCategory() != null) {
                r.setExpenseCategory(x.getExpenseCategory().getName());
            }

            if (x.getApprovedBy() != null) {
                r.setApprovedBy(new ApproverResponse(
                        x.getApprovedBy().getId(),
                        x.getApprovedBy().getUserName())
                );
            }

            if (x.getProofs() != null) {
                r.setProofs(x.getProofs().stream().map(p ->
                        new ExpenseProofResponse(p.getId(), p.getDocUrl())).toList()
                );
            }

            return r;
        }).toList();
    }

    public TravelPlanExpense toExpenseEntity(CreateExpenseRequest req, TravelPlan travelPlan, User participant, ExpenseCategory category) {
        TravelPlanExpense expense = new TravelPlanExpense();
        expense.setAmount(req.getAmount());
        expense.setDate(req.getDate());
        expense.setStatus(req.getStatus());
        expense.setTravelPlan(travelPlan);
        expense.setExpenseCategory(category);
        expense.setParticipant(participant);
        expense.setSubmittedAt(LocalDateTime.now());

        if (req.getProofs() != null) {
            for (var p : req.getProofs()) {
                TravelPlanExpenseProof proof = new TravelPlanExpenseProof();
                proof.setDocUrl(p.getDocUrl());
                proof.setExpense(expense);
                expense.getProofs().add(proof);
            }
        }

        return expense;
    }

    public List<ParticipantDocumentResponse> toDocumentResponseList(List<TravelPlanDocument> documents) {
        return documents.stream().map(d -> {
            ParticipantDocumentResponse r = new ParticipantDocumentResponse();
            r.setId(d.getId());
            r.setDocUrl(d.getDocUrl());
            r.setOwner(d.getOwner() != null ? d.getOwner().getId() : null);
            r.setDocumentType(d.getDocumentType() != null ? d.getDocumentType().getName() : null);
            r.setUploadedAt(d.getUploadedAt());
            r.setUploadedBy(d.getUploadedBy() != null ? d.getUploadedBy().getId() : null);
            return r;
        }).toList();
    }

    public TravelPlanDocument toDocumentEntity(CreateTravelPlanDocumentRequest req, TravelPlan travelPlan, User owner, DocumentType dt, User uploadedBy) {
        TravelPlanDocument doc = new TravelPlanDocument();
        doc.setDocUrl(req.getDocUrl());
        doc.setOwner(owner);
        doc.setTravelPlan(travelPlan);
        doc.setDocumentType(dt);
        doc.setUploadedBy(uploadedBy);
        return doc;
    }
}
