package com.aayush.lad.hrms.modules.user.dtos.user.read.internal;

import com.aayush.lad.hrms.modules.user.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private String firstName;

    private String middleName;

    private String lastName;

    private String contactNumber;

    private LocalDate dateOfBirth;

    private Gender gender;

    private LocalDate joiningDate;

    private String avatarUrl;

    private DepartmentSummaryResponse department;

    private DesignationSummaryResponse designation;

    private ManagerSummaryResponse manager;
}
