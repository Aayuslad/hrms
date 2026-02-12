package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.ParticipantResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanSummaryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.mappers.TravelPlanMapper;
import com.aayush.lad.hrms.modules.travel.models.TravelPlan;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanDocument;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanExpense;
import com.aayush.lad.hrms.modules.travel.repositories.TravelPlanRepository;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import com.aayush.lad.hrms.modules.user.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TravelPlanService {

    private final TravelPlanRepository travelPlanRepository;
    private final UserRepository userRepository;
    private final TravelPlanMapper travelPlanMapper;
    private final NotificationService notificationService;

    public void create(CreateTravelPlanRequest request) {
        TravelPlan travelPlan = travelPlanMapper.toEntity(request);
        travelPlanRepository.save(travelPlan);
    }

    public void update(UpdateTravelPlanRequest request) {
        TravelPlan oldTravelPlan = travelPlanRepository.findByIdWithParticipants(request.getId()).orElse(null);

        if (oldTravelPlan == null)
            throw new NotFoundException("Travel plan not found");

        TravelPlan newTravelPlan = travelPlanMapper.toEntity(request);

        if (newTravelPlan.getParticipants() != null && !newTravelPlan.getParticipants().isEmpty()) {
            for (User x : newTravelPlan.getParticipants()) {
                if (oldTravelPlan.getParticipants().contains(x)) continue;

                String content = "You are added in a travel plan by " + newTravelPlan.getUpdatedBy().getUserName();
                notificationService.createNotification(x.getId(), content);
            }
        }

        for (User x : oldTravelPlan.getParticipants()) {
            if (newTravelPlan.getParticipants().contains(x)) continue;

            String content = "You are removed from a travel plan by " + newTravelPlan.getUpdatedBy().getUserName();
            notificationService.createNotification(x.getId(), content);
        }

        travelPlanRepository.save(newTravelPlan);
    }

    public TravelPlanResponse getById(UUID id) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithParticipants(id).orElse(null);

        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");

        return travelPlanMapper.toResponse(travelPlan);
    }

    public List<TravelPlanSummaryResponse> getAll() {
        List<TravelPlan> travelPlans = travelPlanRepository.findAll();

        return travelPlanMapper.toSumaryResponseList(travelPlans);
    }

    public void delete(UUID id) {
        if (!travelPlanRepository.existsById(id)) {
            throw new NotFoundException("Travel plan not found");
        }
        // TODO: soft delete
        travelPlanRepository.deleteById(id);
    }


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
}
