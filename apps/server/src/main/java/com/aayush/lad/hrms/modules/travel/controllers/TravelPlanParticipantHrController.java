package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.internal.ParticipantExpenseResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanDocumentRequest;
import com.aayush.lad.hrms.modules.travel.services.TravelPlanService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/travel-plans")
@AllArgsConstructor
public class TravelPlanParticipantHrController {

    private final TravelPlanService travelPlanService;

    @PatchMapping("/{travelPlanId}/participant/{participantId}/expenses/{expenseId}/approve")
    public ResponseEntity<Result<ParticipantExpenseResponse>> approveExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @PathVariable UUID expenseId) {
        ParticipantExpenseResponse response = travelPlanService.approveExpense(travelPlanId, participantId, expenseId);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PatchMapping("/{travelPlanId}/participant/{participantId}/expenses/{expenseId}/reject")
    public ResponseEntity<Result<Void>> rejectExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @PathVariable UUID expenseId) {
        travelPlanService.rejectExpense(travelPlanId, participantId, expenseId);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PostMapping("/{travelPlanId}/participant/{participantId}/documents/hr")
    public ResponseEntity<Result<Void>> createDocumentByHr(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @Valid @RequestBody CreateTravelPlanDocumentRequest request) {

        request.setTravelPlanId(travelPlanId);
        if (request.getOwnerId() == null)
            request.setOwnerId(participantId);

        travelPlanService.createDocument(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }
}
