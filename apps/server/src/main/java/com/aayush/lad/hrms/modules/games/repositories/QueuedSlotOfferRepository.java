package com.aayush.lad.hrms.modules.games.repositories;

import com.aayush.lad.hrms.modules.games.enums.QueuedSlotOfferStatus;
import com.aayush.lad.hrms.modules.games.models.QueuedSlotOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QueuedSlotOfferRepository extends JpaRepository<QueuedSlotOffer, UUID> {

    /**
     * Find an offer between a queue entry and a cancelled slot by status.
     **
     * @param queueSlotId the pending queue entry ID
     * @param cancelledSlotId the slot that was cancelled
     * @param status the status to match (typically PENDING)
     * @return Optional containing the offer if found
     */
    Optional<QueuedSlotOffer> findByQueueSlotIdAndCancelledSlotIdAndStatus(
            UUID queueSlotId,
            UUID cancelledSlotId,
            QueuedSlotOfferStatus status
    );

    /**
     * Find all offers associated with a cancelled slot (any status).
     * 
     * @param cancelledSlotId the slot that was cancelled
     * @return list of all offers linked to this cancellation
     */
    @Query("select o from QueuedSlotOffer o where o.cancelledSlot.id = :cancelledSlotId")
    List<QueuedSlotOffer> findByCancelledSlotId(@Param("cancelledSlotId") UUID cancelledSlotId);

    /**
     * Find pending offers that have passed their expiration time.
     * 
     * @param status the status to match (typically PENDING)
     * @param time the cutoff time; returns offers that expired before this time
     * @return list of expired offers
     */
    List<QueuedSlotOffer> findByStatusAndExpiresAtBefore(QueuedSlotOfferStatus status, LocalDateTime time);

    /**
     * Retrieve all offers where the pending queue's organiser matches given user.
     * 
     * @param organiserId the user ID of the organiser
     * @return list of offers tied to the organiser's queue entries
     */
    @Query("select o from QueuedSlotOffer o where o.queueSlot.organiser.id = :orgId")
    List<QueuedSlotOffer> findByQueueSlotOrganiserId(@Param("orgId") UUID organiserId);
}