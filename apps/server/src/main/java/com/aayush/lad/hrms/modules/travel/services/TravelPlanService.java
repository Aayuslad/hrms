package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.modules.travel.repositories.TravelPlanRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TravelPlanService {

    private final TravelPlanRepository travelPlanRepository;
}
