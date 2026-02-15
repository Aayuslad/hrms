package com.aayush.lad.hrms.modules.games.repositories;

import com.aayush.lad.hrms.modules.games.models.Game;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;


public interface GameRepository extends JpaRepository<Game, UUID> {

    /**
     * Find a game with all its associated user stats eager-loaded.
     * 
     * Used by GameService.getOne() to fetch game details along with stats.
     * 
     * @param id game ID
     * @return Optional containing game with stats if found
     */
    @EntityGraph(attributePaths = "userGameStats")
    @Query("SELECT g FROM Game g WHERE g.id = :id")
    Optional<Game> findGameWithStatsById(@Param("id") UUID id);

    /**
     * Count CONFIRMED or PENDING slots for a game.
     * 
     * Used by QueueAllocationService to determine if a cycle should advance.
     * A game is ready for new cycle only when this count is zero (queue empty, all slots completed/cancelled).
     * 
     * @param gameId the game ID
     * @return count of active (unresolved) slots
     */
    // Find all confirmed or pending slots for a given game
    @Query("select count(s) from GameSlot s where s.game.id = :gameId " +
            "and (s.status = com.aayush.lad.hrms.modules.games.enums.GameSlotStatus.CONFIRMED " +
            "or s.status = com.aayush.lad.hrms.modules.games.enums.GameSlotStatus.PENDING)")
    long countActiveOrPendingSlots(@Param("gameId") UUID gameId);
}
