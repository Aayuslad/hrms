package com.aayush.lad.hrms.modules.user.repositories;

import com.aayush.lad.hrms.modules.user.models.Notification;
import com.aayush.lad.hrms.modules.user.models.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

        Optional<User> findByUserName(String userName);

        boolean existsByEmail(String email);

        boolean existsByUserName(String userName);

        Optional<User> findByUserNameOrEmail(String userName, String email);

        @Query("select n from Notification n " +
                        " where n.user.id = :userId " +
                        " order by n.createdAt desc")
        List<Notification> fetchAllNotifications(
                        UUID userId);

        @EntityGraph(attributePaths = {
                        "roles"
        })
        @Query("SELECT u FROM User u WHERE u.userName = :userName")
        Optional<User> findUserByUserNameAndWithRoles(@Param("userName") String userName);

        @EntityGraph(attributePaths = { "roles" })
        @Query("SELECT u FROM User u")
        List<User> findAllWithRoles();
}
