package com.aayush.lad.hrms.modules.user.mappers;

import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.user.dtos.department.read.DepartmentResponse;
import com.aayush.lad.hrms.modules.user.dtos.department.write.CreateDepartmentRequest;
import com.aayush.lad.hrms.modules.user.dtos.department.write.UpdateDepartmentRequest;
import com.aayush.lad.hrms.modules.user.models.Department;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DepartmentMapper {

    private final ModelMapper modelMapper;
    private final CurrentUserService currentUserService;

    public Department create(CreateDepartmentRequest request) {
        Department department = modelMapper.map(request, Department.class);
        department.setCreatedBy(currentUserService.getCurrentUserEntity());
        return department;
    }

    public void update(UpdateDepartmentRequest request, Department existing) {
        modelMapper.map(request, existing);
        existing.setUpdatedBy(currentUserService.getCurrentUserEntity());
    }

    public DepartmentResponse toResponse(Department department) {
        return modelMapper.map(department, DepartmentResponse.class);
    }

    public List<DepartmentResponse> toResponseList(List<Department> departments) {
        return departments.stream()
                .map(this::toResponse)
                .toList();
    }
}
