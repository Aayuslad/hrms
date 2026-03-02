package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddParticipantsRequest {
    @NotEmpty
    private List<UUID> participantIds;
}