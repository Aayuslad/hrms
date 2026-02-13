package com.aayush.lad.hrms.core.services;

import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class CurrentUserService {

    private UserRepository userRepository;

    public String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorisedException();
        }

        return auth.getName();
    }

    public User getCurrentUserEntity() {
        User user = userRepository.findByUserName(this.getUsername()).orElse(null);

        if (user == null)
            throw new UnauthorisedException();

        return user;
    }
}