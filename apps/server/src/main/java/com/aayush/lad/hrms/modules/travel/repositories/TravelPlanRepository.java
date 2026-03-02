package com.aayush.lad.hrms.modules.travel.repositories;

import com.aayush.lad.hrms.modules.travel.models.TravelPlan;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanDocument;
import com.aayush.lad.hrms.modules.travel.models.TravelPlanExpense;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TravelPlanRepository extends JpaRepository<TravelPlan, UUID> {

    @EntityGraph(attributePaths = {
            "participants",
            "travelPlanDocuments",
            "travelPlanDocuments.documentType",
            "expenses",
            "expenses.proofs"
    })
    @Query("select tp from TravelPlan tp where tp.id = :id order by tp.createdAt desc")
    Optional<TravelPlan> findByIdWithAllOrderByCreatedAtDesc(@Param("id") UUID id);

    @EntityGraph(attributePaths = "participants")
    @Query("select tp from TravelPlan tp where tp.id = :id")
    Optional<TravelPlan> findByIdWithParticipants(@Param("id") UUID id);

    @Query("select d from TravelPlanDocument d "
            + "left join fetch d.documentType dt "
            + "where d.travelPlan.id = :travelPlanId and d.owner.id = :participantId")
    List<TravelPlanDocument> findTravelPlanDocumentsByIdAndParticipantId(UUID travelPlanId, UUID participantId);

    @Query("select e from TravelPlanExpense e "
            + "left join fetch e.proofs pr "
            + "left join fetch e.expenseCategory ec "
            + "where e.travelPlan.id = :travelPlanId and e.participant.id = :participantId")
    List<TravelPlanExpense> findTravelPlanExpensesByIdAndParticipantId(UUID travelPlanId, UUID participantId);

    @Query("select count(e) > 0 from TravelPlanExpense e "
            + "where e.expenseCategory.id = :expenseCategoryId")
    boolean existsByExpenseCategoryId(@Param("expenseCategoryId") UUID expenseCategoryId);

    @Query("select count(d) > 0 from TravelPlanDocument d "
            + "where d.documentType.id = :documentTypeId")
    boolean existsByDocumentTypeId(@Param("documentTypeId") UUID documentTypeId);
}
