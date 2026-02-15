package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateDocumentRequest;
import com.aayush.lad.hrms.modules.travel.services.TravelPlanDocumentService;
import com.aayush.lad.hrms.modules.travel.services.TravelPlanExpenseService;
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

    private final TravelPlanExpenseService travelPlanExpenseService;
    private final TravelPlanDocumentService travelPlanDocumentsService;

    @PatchMapping("/{travelPlanId}/participant/{participantId}/expenses/{expenseId}/approve")
    public ResponseEntity<Result<Void>> approveExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID expenseId) {
        travelPlanExpenseService.approveExpense(travelPlanId, expenseId);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PatchMapping("/{travelPlanId}/participant/{participantId}/expenses/{expenseId}/reject")
    public ResponseEntity<Result<Void>> rejectExpense(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID expenseId) {
        travelPlanExpenseService.rejectExpense(travelPlanId, expenseId);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PostMapping("/{travelPlanId}/participant/{participantId}/documents/hr")
    public ResponseEntity<Result<Void>> createDocumentByHr(
            @PathVariable UUID travelPlanId,
            @PathVariable UUID participantId,
            @Valid @RequestBody CreateDocumentRequest request) {

        request.setTravelPlanId(travelPlanId);
        if (request.getOwnerId() == null)
            request.setOwnerId(participantId);

        travelPlanDocumentsService.createDocument(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }
}
