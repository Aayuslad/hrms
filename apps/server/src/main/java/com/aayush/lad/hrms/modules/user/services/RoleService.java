package com.aayush.lad.hrms.modules.user.services;

import com.aayush.lad.hrms.modules.user.dtos.role.read.RoleResponse;
import com.aayush.lad.hrms.modules.user.mappers.RoleMapper;
import com.aayush.lad.hrms.modules.user.models.Role;
import com.aayush.lad.hrms.modules.user.repositories.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public List<RoleResponse> getAll() {
        List<Role> roles = roleRepository.findAll();
        return roleMapper.toResponseList(roles);
    }
}
