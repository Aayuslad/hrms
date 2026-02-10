package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.read.TravelPlanSummaryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.CreateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.UpdateTravelPlanRequest;
import com.aayush.lad.hrms.modules.travel.services.TravelPlanService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/travel-plans")
@AllArgsConstructor
public class TravelPlanController {

    private final TravelPlanService travelPlanService;

    @GetMapping("/{id}")
    public ResponseEntity<Result<TravelPlanResponse>> update(@PathVariable UUID id) {
        TravelPlanResponse response = travelPlanService.getById(id);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @GetMapping
    public ResponseEntity<Result<List<TravelPlanSummaryResponse>>> getAll() {
        List<TravelPlanSummaryResponse> response = travelPlanService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PostMapping
    public ResponseEntity<Result<TravelPlanResponse>> create(
            @Valid @RequestBody CreateTravelPlanRequest request) {
        TravelPlanResponse response = travelPlanService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED, response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result<TravelPlanResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTravelPlanRequest request) {
        request.setId(id);
        TravelPlanResponse response = travelPlanService.update(request);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Result<Void>> delete(@PathVariable UUID id) {
        travelPlanService.delete(id);
        return ResultMapper.handle(HttpStatus.NO_CONTENT);
    }
}
