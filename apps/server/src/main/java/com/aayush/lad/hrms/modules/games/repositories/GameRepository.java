package com.aayush.lad.hrms.modules.games.repositories;

import com.aayush.lad.hrms.modules.games.models.Game;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


public interface GameRepository extends JpaRepository<Game, UUID> {

    @EntityGraph(attributePaths = "userGameStats")
    @Query("SELECT g FROM Game g WHERE g.id = :id")
    Optional<Game> findGameWithStatsById(@Param("id") UUID id);
}
