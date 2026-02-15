package com.aayush.lad.hrms.modules.games.dtos.read;

import com.aayush.lad.hrms.modules.games.enums.QueuedSlotOfferStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueuedSlotOfferResponse {
    private UUID id;
    private UUID queueSlotId;
    private UUID cancelledSlotId;
    private QueuedSlotOfferStatus status;
    private LocalDateTime expiresAt;
}