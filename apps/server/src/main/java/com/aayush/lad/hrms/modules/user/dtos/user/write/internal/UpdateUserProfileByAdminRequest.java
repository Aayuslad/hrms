package com.aayush.lad.hrms.modules.user.dtos.user.write.internal;

import com.aayush.lad.hrms.modules.user.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserProfileByAdminRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String contactNumber;

    private LocalDate dateOfBirth;

    private Gender gender;

    private LocalDate joiningDate;

    private UUID departmentId;

    private UUID designationId;

    private UUID managerId;
}
