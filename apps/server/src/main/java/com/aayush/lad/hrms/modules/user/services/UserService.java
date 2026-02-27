package com.aayush.lad.hrms.modules.user.services;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.core.exeptions.UnauthorisedException;
import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.user.dtos.user.read.NotificationResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.OrgCharts;
import com.aayush.lad.hrms.modules.user.dtos.user.read.UserDetailResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.read.internal.EmployeeOrgChartNodeResponse;
import com.aayush.lad.hrms.modules.user.dtos.user.write.*;
import com.aayush.lad.hrms.modules.user.mappers.UserMapper;
import com.aayush.lad.hrms.modules.user.models.Notification;
import com.aayush.lad.hrms.modules.user.models.Profile;
import com.aayush.lad.hrms.modules.user.models.Role;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.modules.user.repositories.DepartmentRepository;
import com.aayush.lad.hrms.modules.user.repositories.DesignationRepository;
import com.aayush.lad.hrms.modules.user.repositories.RoleRepository;
import com.aayush.lad.hrms.modules.user.repositories.UserRepository;
import com.aayush.lad.hrms.shared.dtos.GlobalUserResponseSummary;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class UserService {
    private final NotificationService notificationService;

    public void markNotificationsAsRead(List<UUID> notificationIds) {
        notificationService.markNotificationsAsRead(notificationIds);
    }

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;

    private final UserMapper userMapper;
    private final CurrentUserService currentUserService;
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserDetailResponse registerUser(RegisterUserRequest request) {
        if (userRepository.existsByUserName(request.getUserName()))
            throw new ConflictException("Username already exists");

        if (userRepository.existsByEmail(request.getEmail()))
            throw new ConflictException("Email already exists");

        User newUser = userMapper.create(request);
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(newUser);

        return userMapper.toDetailResponse(savedUser);
    }

    public UserDetailResponse loginUser(LoginUserRequest request) {
        User user = userRepository.findByUserNameOrEmail(
                request.getEmailOrUserName(),
                request.getEmailOrUserName()
        ).orElse(null);
        if (user == null) throw new NotFoundException("User not found with given email or username");

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
            throw new UnauthorisedException("Invalid password");

        return userMapper.toDetailResponse(user);
    }

    public void createProfile(CreateUserProfileRequest request) {
        User user = userRepository.findByUserName(currentUserService.getUsername()).orElse(null);
        if (user == null) throw new UnauthorisedException("User does not exist");

        Profile profile = userMapper.create(request);
//        profile.setAvatarUrl(fileUploadService.uploadFile(request.getAvatar()));
        profile.setUser(user);
        user.setProfile(profile);

        userRepository.save(user);
    }

    public UserDetailResponse getCurrentUser() {
        User user = userRepository.findByUserName(currentUserService.getUsername()).orElse(null);
        if (user == null) throw new UnauthorisedException();
        return userMapper.toDetailResponse(user);
    }

    public UserDetailResponse getUserById(UUID id) {
        User user = this.getUserEntityById(id);
        return userMapper.toDetailResponse(user);
    }

    public void update(UpdateUserBySelfRequest request) {
        User user = currentUserService.getCurrentUserEntity();

        userMapper.update(request, user);
//        if (request.getAvatar() != null) {
//            fileUploadService.deleteFileByURL(user.getProfile().getAvatarUrl());
//            updatedUser.getProfile().setAvatarUrl(fileUploadService.uploadFile(request.getAvatar()));
//        }

        userRepository.save(user);
    }

    public void update(UpdateUserByAdminRequest request) {
        User user = this.getUserEntityById(request.getUserId());

        userMapper.update(request, user);

        user.getProfile().setUser(user);
        UUID departmentId = request.getProfile().getDepartmentId();
        UUID designationId = request.getProfile().getDesignationId();
        UUID mangerId = request.getProfile().getManagerId();

        if (departmentId != null) {
            departmentRepository.findById(departmentId)
                    .ifPresent(value -> user.getProfile().setDepartment(value));
        }
        if (designationId != null) {
            designationRepository.findById(designationId)
                    .ifPresent(value -> user.getProfile().setDesignation(value));
        }
        if (mangerId != null) {
            userRepository.findById(mangerId)
                    .ifPresent(value -> user.getProfile().setManager(value));
        }

//        if (request.getAvatar() != null) {
//            fileUploadService.deleteFileByURL(user.getProfile().getAvatarUrl());
//            updatedUser.getProfile().setAvatarUrl(fileUploadService.uploadFile(request.getAvatar()));
//        }

        userRepository.save(user);
    }

    public List<NotificationResponse> getRecentNotifications() {
        User user = currentUserService.getCurrentUserEntity();

        List<Notification> notifications = userRepository.fetchAllNotifications(user.getId());

        return userMapper.toNotificationResponseList(notifications);
    }

    public List<GlobalUserResponseSummary> getUsersSummary() {
        return userMapper.toResponse(userRepository.findAll().stream().toList());
    }

    public List<UserDetailResponse> getAllUsersDetails() {
        List<User> users = userRepository.findAllWithRoles();
        return users.stream().map(userMapper::toDetailResponse).toList();
    }

    public void updateUserRoles(UpdateUserRolesRequest request) {
        User user = this.getUserEntityById(request.getUserId());

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            List<Role> roles = roleRepository.findAllById(request.getRoles());
            user.getRoles().addAll(roles);
        }

        userRepository.save(user);
    }

    /**
     * Returns the complete organisation chart (current behaviour).
     */
    public OrgCharts getOrgCharts() {
        return getOrgCharts((UUID) null);
    }

    /**
     * Returns an organisation chart rooted around the provided user id.
     *
     * <p>Behaviour:
     * <ul>
     *     <li>If {@code userId} is null the full tree is returned (same as the
     *     old method).</li>
     *     <li>Otherwise the payload contains a single root node which is the
     *     top‑most manager in the selected employee's chain (or the selected
     *     employee itself if there is no manager).  The chain is represented as a
     *     vertical path: each manager only has a single child pointing towards the
     *     selected employee.  The selected employee node also includes one level of
     *     direct reports, but no deeper hierarchy.</li>
     * </ul>
     */
    public OrgCharts getOrgCharts(UUID userId) {
        List<User> allUsers = userRepository.findAllWithProfiles();

        Map<UUID, List<User>> subordinates = new HashMap<>();
        Map<UUID, User> usersById = new HashMap<>();
        List<User> roots = new ArrayList<>();

        for (User user : allUsers) {
            usersById.put(user.getId(), user);
            UUID managerId = user.getProfile() != null && user.getProfile().getManager() != null
                    ? user.getProfile().getManager().getId()
                    : null;
            if (managerId == null) {
                roots.add(user);
            } else {
                subordinates.computeIfAbsent(managerId, k -> new ArrayList<>()).add(user);
            }
        }

        if (userId == null) {
            // full organisation chart
            List<EmployeeOrgChartNodeResponse> orgCharts = roots.stream()
                    .map(user -> buildNode(user, subordinates))
                    .toList();
            return OrgCharts.builder().orgCharts(orgCharts).build();
        }

        User selected = usersById.get(userId);
        if (selected == null) {
            throw new NotFoundException("User not found");
        }

        // build manager chain from selected up to root
        List<User> chain = new ArrayList<>();
        User cursor = selected;
        while (cursor.getProfile() != null && cursor.getProfile().getManager() != null) {
            User manager = cursor.getProfile().getManager();
            chain.add(manager);
            cursor = manager;
        }
        // chain currently bottom‑up (immediate manager first). Reverse to get
        // top‑down order.
        Collections.reverse(chain);

        EmployeeOrgChartNodeResponse rootNode;
        if (chain.isEmpty()) {
            // selected user is already a root
            rootNode = buildNodeLimited(selected, subordinates, 1);
        } else {
            rootNode = buildChainNode(chain, selected, subordinates);
        }

        return OrgCharts.builder().orgCharts(List.of(rootNode)).build();
    }

    /**
     * Builds a node and its subtree but stops descending after {@code maxDepth}
     * levels (0 == no children).
     */
    private EmployeeOrgChartNodeResponse buildNodeLimited(User user,
                                                          Map<UUID, List<User>> subordinates,
                                                          int maxDepth) {
        List<EmployeeOrgChartNodeResponse> manages = new ArrayList<>();
        if (maxDepth > 0) {
            manages = subordinates.getOrDefault(user.getId(), new ArrayList<>()).stream()
                    .map(sub -> buildNodeLimited(sub, subordinates, maxDepth - 1))
                    .toList();
        }
        return EmployeeOrgChartNodeResponse.builder()
                .userId(user.getId())
                .username(user.getUserName())
                .firstName(user.getProfile() != null ? user.getProfile().getFirstName() : null)
                .lastName(user.getProfile() != null ? user.getProfile().getLastName() : null)
                .designation(user.getProfile() != null && user.getProfile().getDesignation() != null
                        ? user.getProfile().getDesignation().getName() : null)
                .department(user.getProfile() != null && user.getProfile().getDepartment() != null
                        ? user.getProfile().getDepartment().getName() : null)
                .avatarUrl(user.getProfile() != null ? user.getProfile().getAvatarUrl() : null)
                .manages(manages)
                .build();
    }

    /**
     * Builds a single-root chain based on the supplied manager list; the last
     * element of {@code chain} is the immediate manager of {@code selected}.
     */
    private EmployeeOrgChartNodeResponse buildChainNode(List<User> chain,
                                                       User selected,
                                                       Map<UUID, List<User>> subordinates) {
        // start with selected node including direct reports
        EmployeeOrgChartNodeResponse child = buildNodeLimited(selected, subordinates, 1);
        // walk the chain back to the top
        for (int i = chain.size() - 1; i >= 0; i--) {
            User manager = chain.get(i);
            EmployeeOrgChartNodeResponse mgrNode = EmployeeOrgChartNodeResponse.builder()
                    .userId(manager.getId())
                    .username(manager.getUserName())
                    .firstName(manager.getProfile() != null ? manager.getProfile().getFirstName() : null)
                    .lastName(manager.getProfile() != null ? manager.getProfile().getLastName() : null)
                    .designation(manager.getProfile() != null && manager.getProfile().getDesignation() != null
                            ? manager.getProfile().getDesignation().getName() : null)
                    .department(manager.getProfile() != null && manager.getProfile().getDepartment() != null
                            ? manager.getProfile().getDepartment().getName() : null)
                    .avatarUrl(manager.getProfile() != null ? manager.getProfile().getAvatarUrl() : null)
                    .manages(List.of(child))
                    .build();
            child = mgrNode;
        }
        return child;
    }

    private EmployeeOrgChartNodeResponse buildNode(User user, Map<UUID, List<User>> subordinates) {
        List<EmployeeOrgChartNodeResponse> manages = subordinates.getOrDefault(user.getId(), new ArrayList<>()).stream()
                .map(sub -> buildNode(sub, subordinates))
                .toList();

        return EmployeeOrgChartNodeResponse.builder()
                .userId(user.getId())
                .username(user.getUserName())
                .firstName(user.getProfile() != null ? user.getProfile().getFirstName() : null)
                .lastName(user.getProfile() != null ? user.getProfile().getLastName() : null)
                .designation(user.getProfile() != null && user.getProfile().getDesignation() != null ? user.getProfile().getDesignation().getName() : null)
                .department(user.getProfile() != null && user.getProfile().getDepartment() != null ? user.getProfile().getDepartment().getName() : null)
                .avatarUrl(user.getProfile() != null ? user.getProfile().getAvatarUrl() : null)
                .manages(manages)
                .build();
    }

    private User getUserEntityById(UUID id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) throw new NotFoundException("User not found");

        return user;
    }
}
