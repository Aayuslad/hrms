package com.aayush.lad.hrms.modules.engagement.services;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.models.Profile;
import com.aayush.lad.hrms.modules.engagement.repositories.PostRepository;
import com.aayush.lad.hrms.modules.engagement.models.Post;
import java.time.LocalDate;
import java.util.List;

@Service
public class SystemPostSchedulerService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;

    // Runs every day at 00:01
    @Scheduled(cron = "0 1 0 * * *")
    public void createSystemPosts() {
        LocalDate today = LocalDate.now();
        // Fetch all users with their profiles
        List<User> users = userRepository.findAllWithProfiles();

        // Birthday posts
        StringBuilder birthdayMsg = new StringBuilder();
        for (User user : users) {
            Profile profile = user.getProfile();
            if (profile != null && profile.getDateOfBirth() != null) {
                if (profile.getDateOfBirth().getMonthValue() == today.getMonthValue() &&
                    profile.getDateOfBirth().getDayOfMonth() == today.getDayOfMonth()) {
                    birthdayMsg.append(profile.getFirstName()).append(" ")
                        .append(profile.getLastName()).append(", ");
                }
            }
        }
        if (birthdayMsg.length() > 0) {
            String msg = "Happy Birthday to: " + birthdayMsg.substring(0, birthdayMsg.length() - 2) + "!";
            createSystemPost("Birthdays", msg);
        }

        // Anniversary posts
        StringBuilder annivMsg = new StringBuilder();
        for (User user : users) {
            Profile profile = user.getProfile();
            if (profile != null && profile.getJoiningDate() != null) {
                if (profile.getJoiningDate().getMonthValue() == today.getMonthValue() &&
                    profile.getJoiningDate().getDayOfMonth() == today.getDayOfMonth()) {
                    int years = today.getYear() - profile.getJoiningDate().getYear();
                    annivMsg.append(profile.getFirstName()).append(" ")
                        .append(profile.getLastName()).append(" (" + years + " year" + (years > 1 ? "s" : "") + "), ");
                }
            }
        }
        if (annivMsg.length() > 0) {
            String msg = "Work Anniversary: " + annivMsg.substring(0, annivMsg.length() - 2) + "!";
            createSystemPost("Anniversaries", msg);
        }
    }

    private void createSystemPost(String title, String content) {
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setAuthor(null); // System generated
        postRepository.save(post);
    }
}
