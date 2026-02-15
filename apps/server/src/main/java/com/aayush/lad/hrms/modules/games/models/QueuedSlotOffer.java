package com.aayush.lad.hrms.modules.games.models;

import com.aayush.lad.hrms.modules.games.enums.QueuedSlotOfferStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "queued_slot_offers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueuedSlotOffer {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "queue_slot_id", nullable = false)
    private GameSlot queueSlot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cancelled_slot_id", nullable = false)
    private GameSlot cancelledSlot;

    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    private QueuedSlotOfferStatus status;
}