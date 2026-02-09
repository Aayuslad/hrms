package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.modules.travel.services.TravelPlanService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/travel-plans")
@AllArgsConstructor
public class TravelPlanController {

    private final TravelPlanService travelPlanService;
}
