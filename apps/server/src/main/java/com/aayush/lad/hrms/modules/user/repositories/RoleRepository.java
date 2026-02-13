package com.aayush.lad.hrms.modules.user.repositories;

import com.aayush.lad.hrms.modules.user.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
}
