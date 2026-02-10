package com.aayush.lad.hrms.modules.travel.dtos.travel_plan.write.internal;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantRequest {

    @NotNull(message = "Participant id can not be null")
    private UUID participantId;
}
