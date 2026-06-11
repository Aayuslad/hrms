package com.aayush.lad.hrms.config;

import com.aayush.lad.hrms.modules.user.models.Role;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.RoleRepository;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Ensure roles exist
        Role adminRole = roleRepository.findByName("Admin").orElseGet(() -> {
            Role r = new Role();
            r.setName("Admin");
            return roleRepository.save(r);
        });

        Role hrRole = roleRepository.findByName("HR").orElseGet(() -> {
            Role r = new Role();
            r.setName("HR");
            return roleRepository.save(r);
        });

        Role employeeRole = roleRepository.findByName("Employee").orElseGet(() -> {
            Role r = new Role();
            r.setName("Employee");
            return roleRepository.save(r);
        });

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Create admin demo user
        if (!userRepository.existsByEmail("admin.user@example.com") && !userRepository.existsByUserName("admin.user")) {
            User admin = new User();
            admin.setUserName("admin.user");
            admin.setEmail("admin.user@example.com");
            admin.setPasswordHash(encoder.encode("123###"));
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(hrRole);
            admin.setRoles(roles);
            userRepository.save(admin);
        }

        // Create employee demo user
        if (!userRepository.existsByEmail("employee.one@example.com") && !userRepository.existsByUserName("employee.one")) {
            User emp = new User();
            emp.setUserName("employee.one");
            emp.setEmail("employee.one@example.com");
            emp.setPasswordHash(encoder.encode("123###"));
            Set<Role> roles = new HashSet<>();
            roles.add(employeeRole);
            emp.setRoles(roles);
            userRepository.save(emp);
        }
    }
}
