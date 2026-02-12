package com.aayush.lad.hrms.modules.user.dtos.user.write;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
public class UpdateUserRolesRequest {

    @NotNull(message = "User can not be null")
    private UUID userId;

    private Set<UUID> roles;
}
