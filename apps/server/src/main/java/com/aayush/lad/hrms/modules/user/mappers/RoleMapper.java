package com.aayush.lad.hrms.modules.user.mappers;

import com.aayush.lad.hrms.modules.user.dtos.role.read.RoleResponse;
import com.aayush.lad.hrms.modules.user.models.Role;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RoleMapper {
    private final ModelMapper modelMapper;

    public RoleResponse toResponse(Role role) {
        return modelMapper.map(role, RoleResponse.class);
    }

    public List<RoleResponse> toResponseList(List<Role> roles) {
        return roles.stream()
                .map(this::toResponse)
                .toList();
    }
}
