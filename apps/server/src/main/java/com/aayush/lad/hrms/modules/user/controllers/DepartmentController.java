package com.aayush.lad.hrms.modules.user.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.user.dtos.department.read.DepartmentResponse;
import com.aayush.lad.hrms.modules.user.dtos.department.write.CreateDepartmentRequest;
import com.aayush.lad.hrms.modules.user.dtos.department.write.UpdateDepartmentRequest;
import com.aayush.lad.hrms.modules.user.services.DepartmentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
@AllArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<Result<List<DepartmentResponse>>> getAll() {
        List<DepartmentResponse> response = departmentService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Result<Void>> create(
            @Valid @RequestBody CreateDepartmentRequest request) {
        departmentService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED, "Department created");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Result<Void>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateDepartmentRequest request) {
        request.setId(id);
        departmentService.update(request);
        return ResultMapper.handle(HttpStatus.OK, "Department updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Result<Void>> delete(@PathVariable UUID id) {
        departmentService.delete(id);
        return ResultMapper.handle(HttpStatus.NO_CONTENT, "Department deleted");
    }
}
