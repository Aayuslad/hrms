package com.aayush.lad.hrms.modules.travel.mappers;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanSummaryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantDocumentResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantExpenseResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateExpenseRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.models.TravelPlan;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanDocument;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanExpense;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TravelPlanMapper {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public TravelPlan create(CreateTravelPlanRequest request) {
        TravelPlan travelPlan = modelMapper.map(request, TravelPlan.class);
        travelPlan.setCreatedBy(currentUserService.getCurrentUserEntity());
        return travelPlan;
    }

    public void update(UpdateTravelPlanRequest request, TravelPlan existing) {
        modelMapper.map(request, existing);

        existing.setUpdatedBy(currentUserService.getCurrentUserEntity());

        existing.getParticipants().clear();

        if (request.getParticipants() != null && !request.getParticipants().isEmpty()) {
            List<User> participants = userRepository.findAllById(request.getParticipants());
            existing.getParticipants().addAll(participants);
        }
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
            r.setParticipant(modelMapper.map(x.getParticipant(), GlobalUserResponseSummary.class));
            return r;
        }).toList();
    }

    public TravelPlanExpense toExpenseEntity(CreateExpenseRequest req) {
        return modelMapper.map(req, TravelPlanExpense.class);
    }

    public List<ParticipantDocumentResponse> toDocumentResponseList(List<TravelPlanDocument> documents) {
        return documents.stream().map(d -> {
            ParticipantDocumentResponse response = modelMapper.map(d, ParticipantDocumentResponse.class);
            response.setDocumentType(d.getDocumentType() != null ? d.getDocumentType().getName() : null);
            return response;
        }).toList();
    }
}
