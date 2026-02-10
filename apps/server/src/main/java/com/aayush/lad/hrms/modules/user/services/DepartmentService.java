package com.aayush.lad.hrms.modules.user.services;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.modules.user.dtos.department.read.DepartmentResponse;
import com.aayush.lad.hrms.modules.user.dtos.department.write.CreateDepartmentRequest;
import com.aayush.lad.hrms.modules.user.dtos.department.write.UpdateDepartmentRequest;
import com.aayush.lad.hrms.modules.user.mappers.DepartmentMapper;
import com.aayush.lad.hrms.modules.user.models.Department;
import com.aayush.lad.hrms.modules.user.repositories.DepartmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    public DepartmentResponse create(CreateDepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new ConflictException("Department with name '" + request.getName() + "' already exists");
        }

        Department department = departmentMapper.toEntity(request);
        Department savedDepartment = departmentRepository.save(department);

        return departmentMapper.toResponse(savedDepartment);
    }

    public List<DepartmentResponse> getAll() {
        List<Department> departments = departmentRepository.findAll();
        return departmentMapper.toResponseList(departments);
    }

    public DepartmentResponse getById(UUID id) {
        Department department = departmentRepository.findById(id).orElse(null);

        if (department == null) {
            throw new NotFoundException("Department not found");
        }

        return departmentMapper.toResponse(department);
    }

    public DepartmentResponse update(UpdateDepartmentRequest request) {
        Department department = departmentRepository.findById(request.getId()).orElse(null);

        if (department == null) {
            throw new NotFoundException("Department not found");
        }

        if (!department.getName().equals(request.getName()) &&
                departmentRepository.existsByName(request.getName())) {
            throw new ConflictException("Department with name '" + request.getName() + "' already exists");
        }

        department.update(request);
        Department updatedDepartment = departmentRepository.save(department);

        return departmentMapper.toResponse(updatedDepartment);
    }

    public void delete(UUID id) {
        if (!departmentRepository.existsById(id)) {
            throw new NotFoundException("Department not found");
        }
        // TODO: soft delete
        departmentRepository.deleteById(id);
    }
}
