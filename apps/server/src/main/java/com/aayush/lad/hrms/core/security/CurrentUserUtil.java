package com.aayush.lad.hrms.core.security;

import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserUtil {

    public String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorisedException();
        }

        return auth.getName();
    }
}