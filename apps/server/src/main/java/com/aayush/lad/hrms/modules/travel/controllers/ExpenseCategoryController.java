package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.read.ExpenseCategoryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.write.CreateExpenseCategoryRequest;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.write.UpdateExpenseCategoryRequest;
import com.aayush.lad.hrms.modules.travel.services.ExpenseCategoryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/expense-categories")
@AllArgsConstructor
public class ExpenseCategoryController {

    private final ExpenseCategoryService expenseCategoryService;

    @PreAuthorize("hasRole('Employee')")
    @GetMapping
    public ResponseEntity<Result<List<ExpenseCategoryResponse>>> getAll() {
        List<ExpenseCategoryResponse> response = expenseCategoryService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @PostMapping
    public ResponseEntity<Result<Void>> create(
            @Valid @RequestBody CreateExpenseCategoryRequest request) {
        expenseCategoryService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @PutMapping("/{id}")
    public ResponseEntity<Result<Void>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateExpenseCategoryRequest request) {
        request.setId(id);
        expenseCategoryService.update(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Result<Void>> delete(@PathVariable UUID id) {
        expenseCategoryService.delete(id);
        return ResultMapper.handle(HttpStatus.NO_CONTENT);
    }
}
