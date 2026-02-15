package com.aayush.lad.hrms.modules.user.repositories;

import com.aayush.lad.hrms.modules.user.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface NotificationRepository extends JpaRepository<Notification, UUID> {

}
