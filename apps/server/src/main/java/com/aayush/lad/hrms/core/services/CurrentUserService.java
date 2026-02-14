package com.aayush.lad.hrms.core.services;

import com.aayush.lad.hrms.modules.user.models.User;


public interface CurrentUserService {

    String getUsername();

    User getCurrentUserEntity();
}