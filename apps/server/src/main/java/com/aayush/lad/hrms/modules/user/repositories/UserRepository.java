package com.aayush.lad.hrms.modules.user.repositories;

import com.aayush.lad.hrms.modules.user.models.Notification;
import com.aayush.lad.hrms.modules.user.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @EntityGraph(attributePaths = {
            "roles",
            "interestedInGames",
            "profile",
            "profile.department",
            "profile.designation",
            "profile.manager",
            "profile.manager.profile",
            "profile.manager.profile.designation"
    })
    @Query("select u from User u where u.id = :id")
    Optional<User> findUserFullDetails(UUID id);

    Optional<User> findByEmail(String email);

    Optional<User> findByUserName(String userName);

    boolean existsByEmail(String email);

    boolean existsByUserName(String userName);

    Optional<User> findByUserNameOrEmail(String userName, String email);

    @Query("""
        select n from Notification n
        where n.user.id = :userId
        order by n.createdAt desc
    """)
    Page<Notification> findRecentNotifications(
            UUID userId,
            Pageable pageable
    );
}

