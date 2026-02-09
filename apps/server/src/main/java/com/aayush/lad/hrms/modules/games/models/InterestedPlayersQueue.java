package com.aayush.lad.hrms.modules.games.models;

import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.shared.base_models.BaseModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "interested_players_queue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterestedPlayersQueue extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime preferredTime;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime appliedAt;

    @Column(nullable = false)
    private boolean isAllotted = false;
}
