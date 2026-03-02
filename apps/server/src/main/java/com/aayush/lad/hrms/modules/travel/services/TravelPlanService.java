package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.ParticipantResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanExpensesResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanSummaryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantExpenseResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.mappers.TravelPlanMapper;
import com.aayush.lad.hrms.modules.travel.models.TravelPlan;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanDocument;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanExpense;
import com.aayush.lad.hrms.modules.travel.enums.ExpenseStatus;
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
    private final CurrentUserService currentUserService;

    public void create(CreateTravelPlanRequest request) {
        TravelPlan travelPlan = travelPlanMapper.create(request);
        travelPlanRepository.save(travelPlan);
    }

    public void update(UpdateTravelPlanRequest request) {
        TravelPlan travelPlan = getTravelPlanEntityById(request.getId());

        List<User> oldParticipants = List.copyOf(travelPlan.getParticipants());

        travelPlanMapper.update(request, travelPlan);

        // notifiy the ones who are added
        if (travelPlan.getParticipants() != null) {
            for (User u : travelPlan.getParticipants()) {
                if (oldParticipants.contains(u))
                    continue;
                String content = "You are added in a travel plan by " +
                        travelPlan.getUpdatedBy().getUserName();
                notificationService.createNotification(u.getId(), content);
            }
        }

        // notify the ones who are removed
        for (User u : oldParticipants) {
            if (travelPlan.getParticipants() != null && travelPlan.getParticipants().contains(u))
                continue;
            String content = "You are removed from a travel plan by " +
                    travelPlan.getUpdatedBy().getUserName();
            notificationService.createNotification(u.getId(), content);
        }

        travelPlanRepository.save(travelPlan);
    }

    public TravelPlanResponse getById(UUID id) {
        TravelPlan travelPlan = getTravelPlanEntityById(id);
        TravelPlanResponse response = TravelPlanResponse.builder()
                .id(travelPlan.getId())
                .title(travelPlan.getTitle())
                .destination(travelPlan.getDestination())
                .description(travelPlan.getDescription())
                .startAt(travelPlan.getStartAt())
                .endAt(travelPlan.getEndAt())
                .maxExpenseAmountPerDay(travelPlan.getMaxExpenseAmountPerDay())
                .build();

        // build full participant responses using existing helper
        List<ParticipantResponse> participantResponses = travelPlan.getParticipants() == null ? List.of()
                : travelPlan.getParticipants().stream()
                        .map(u -> getTravelParticipant(travelPlan.getId(), u.getId()))
                        .toList();
        response.setParticipants(participantResponses);

        return response;
    }

    public List<TravelPlanSummaryResponse> getAll() {
        List<TravelPlan> travelPlans = travelPlanRepository.findAll();
        User currentUser = currentUserService.getCurrentUserEntity();

        if (currentUserService.isUserAdminOrHR()) {

            return travelPlanMapper.toSumaryResponseList(travelPlans);
        }

        List<TravelPlan> filteredTravelPlan = travelPlans.stream()
                .filter(x -> x.getParticipants().contains(currentUser)).toList();

        return travelPlanMapper.toSumaryResponseList(filteredTravelPlan);
    }

    public void delete(UUID id) {
        if (!travelPlanRepository.existsById(id))
            throw new NotFoundException("Travel plan not found");

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
        response.setTotalClaimedAmount((float) expenses.stream()
                .filter(x -> x.getStatus().equals(ExpenseStatus.APPROVED))
                .mapToDouble(TravelPlanExpense::getAmount).sum());

        return response;
    }

    public TravelPlanExpensesResponse getExpenses(UUID travelPlanId) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithAllOrderByCreatedAtDesc(travelPlanId)
                .orElseThrow(() -> new NotFoundException("Travel plan not found"));

        List<TravelPlanExpense> expenses = travelPlan.getExpenses().stream()
                .filter(e -> e.getStatus() != ExpenseStatus.DRAFTING)
                .toList();

        List<ParticipantExpenseResponse> expenseResponses = travelPlanMapper.toExpenseResponseList(expenses);

        float total = (float) expenses.stream()
                .filter(x -> x.getStatus().equals(ExpenseStatus.APPROVED))
                .mapToDouble(TravelPlanExpense::getAmount).sum();

        return new TravelPlanExpensesResponse(expenseResponses, total);
    }

    public void addParticipants(UUID travelPlanId, List<UUID> participantIds) {
        TravelPlan travelPlan = getTravelPlanEntityById(travelPlanId);
        if (participantIds == null || participantIds.isEmpty()) {
            return;
        }
        List<User> users = userRepository.findAllById(participantIds);
        for (User u : users) {
            if (travelPlan.getParticipants().contains(u))
                continue;
            travelPlan.getParticipants().add(u);
            String content = "You are added in a travel plan by " +
                    currentUserService.getCurrentUserEntity().getUserName();
            notificationService.createNotification(u.getId(), content);
        }
        travelPlanRepository.save(travelPlan);
    }

    public void removeParticipants(UUID travelPlanId, List<UUID> participantIds) {
        TravelPlan travelPlan = getTravelPlanEntityById(travelPlanId);
        if (participantIds == null || participantIds.isEmpty()) {
            return;
        }
        List<User> users = userRepository.findAllById(participantIds);
        for (User u : users) {
            if (!travelPlan.getParticipants().contains(u))
                continue;
            travelPlan.getParticipants().remove(u);
            String content = "You are removed from a travel plan by " +
                    currentUserService.getCurrentUserEntity().getUserName();
            notificationService.createNotification(u.getId(), content);
        }
        travelPlanRepository.save(travelPlan);
    }

    private TravelPlan getTravelPlanEntityById(UUID id) {
        TravelPlan travelPlan = travelPlanRepository.findByIdWithParticipants(id).orElse(null);
        if (travelPlan == null)
            throw new NotFoundException("Travel plan not found");
        return travelPlan;
    }
}
