package com.aayush.lad.hrms.modules.travel.repositories;

import com.aayush.lad.hrms.modules.travel.models.TravelPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TravelPlanRepository extends JpaRepository<TravelPlan, UUID> {
}
