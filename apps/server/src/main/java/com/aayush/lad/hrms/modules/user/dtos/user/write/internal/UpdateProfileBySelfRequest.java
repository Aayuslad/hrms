package com.aayush.lad.hrms.modules.user.dtos.user.write.internal;

import com.aayush.lad.hrms.modules.user.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileBySelfRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String contactNumber;

    private LocalDate dateOfBirth;

    private Gender gender;

    private LocalDate joiningDate;
}
