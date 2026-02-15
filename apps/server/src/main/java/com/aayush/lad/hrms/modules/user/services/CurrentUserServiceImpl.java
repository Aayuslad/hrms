package com.aayush.lad.hrms.modules.user.services;

import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Concrete implementation of {@link CurrentUserService}.  Placed in the user module
 * so that the core package does not depend on user‑module classes.
 */
@Component
@AllArgsConstructor
public class CurrentUserServiceImpl implements CurrentUserService {

    private final UserRepository userRepository;

    @Override
    public String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorisedException();
        }

        return auth.getName();
    }

    @Override
    public User getCurrentUserEntity() {
        User user = userRepository.findByUserName(this.getUsername()).orElse(null);

        if (user == null)
            throw new UnauthorisedException();

        return user;
    }
}
