package com.aayush.lad.hrms.modules.travel.mappers;

import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanSummaryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ExpenseProofResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantDocumentResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantExpenseResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.UserSummaryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanDocumentRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateTravelPlanRequest;
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

    public TravelPlan toEntity(CreateTravelPlanRequest request) {
        return modelMapper.map(request, TravelPlan.class);
    }

    public TravelPlan toEntity(UpdateTravelPlanRequest request) {
        TravelPlan travelPlan = modelMapper.map(request, TravelPlan.class);

        travelPlan.getParticipants().clear();

        if (request.getParticipants() != null && !request.getParticipants().isEmpty()) {
            List<User> participants = userRepository.findAllById(
                    request.getParticipants()
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
            ParticipantExpenseResponse r = modelMapper.map(x, ParticipantExpenseResponse.class);
            r.setExpenseCategory(x.getExpenseCategory().getName());
            return r;
        }).toList();
    }

    public TravelPlanExpense toExpenseEntity(CreateExpenseRequest req) {
        TravelPlanExpense expense = modelMapper.map(req, TravelPlanExpense.class);

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
            ParticipantDocumentResponse response = modelMapper.map(d, ParticipantDocumentResponse.class);
            response.setDocumentType(d.getDocumentType() != null ? d.getDocumentType().getName() : null);
            return response;
        }).toList();
    }
}
