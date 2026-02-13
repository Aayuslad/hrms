package com.aayush.lad.hrms.modules.games.dtos.write;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueuedSlotActionRequest {

    @NotNull(message = "Queued slot can not be empty")
    private UUID queuedSlotId;

    @NotNull(message = "Cancelled slot can not be empty")
    private UUID canceledSlotId;

    @NotBlank(message = "Action can not be blank")
    private String action;
}
