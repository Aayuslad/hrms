package com.aayush.lad.hrms.modules.user.services;

import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.services.EmailService;
import com.aayush.lad.hrms.modules.user.models.Notification;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.NotificationRepository;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
public class NotificationService {

	private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	private final EmailService emailService;

	@Transactional
	public Notification createNotification(UUID userId, String content) {
		User user = userRepository.findById(userId).orElse(null);

		if (user == null) {
			throw new NotFoundException("User not found");
		}

		Notification notification = new Notification();
		notification.setContent(content);
		notification.setIsRead(Boolean.FALSE);
		notification.setUser(user);

		Notification saved = notificationRepository.save(notification);

		try {
			String subject = "New notification";
			String body = content;
			emailService.sendSimpleEmail(user.getEmail(), subject, body);
		} catch (Exception ex) {
			logger.warn("Failed to send notification email to {}: {}", user.getEmail(), ex.getMessage());
		}

		return saved;
	}
}
