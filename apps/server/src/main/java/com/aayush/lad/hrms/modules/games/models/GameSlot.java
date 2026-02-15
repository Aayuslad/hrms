package com.aayush.lad.hrms.modules.games.models;

import com.aayush.lad.hrms.modules.games.enums.GameSlotStatus;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.shared.base_models.BaseModel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "game_slots")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameSlot extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDate day;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organiser_id")
    private User organiser;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime appliedAt;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private GameSlotStatus status;

    @Column(nullable = false)
    private int cycleId;

    @ManyToMany
    @JoinTable(
            name = "game_slot_players",
            joinColumns = @JoinColumn(name = "game_slot_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id")
    )
    private Set<User> players = new HashSet<>();
}
