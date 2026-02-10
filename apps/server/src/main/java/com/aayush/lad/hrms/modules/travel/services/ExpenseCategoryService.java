package com.aayush.lad.hrms.modules.travel.services;

import com.aayush.lad.hrms.core.exeptions.ConflictException;
import com.aayush.lad.hrms.core.exeptions.NotFoundException;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.read.ExpenseCategoryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.write.CreateExpenseCategoryRequest;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.write.UpdateExpenseCategoryRequest;
import com.aayush.lad.hrms.modules.travel.mappers.ExpenseCategoryMapper;
import com.aayush.lad.hrms.modules.travel.models.ExpenseCategory;
import com.aayush.lad.hrms.modules.travel.repositories.ExpenseCategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ExpenseCategoryService {

    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final ExpenseCategoryMapper expenseCategoryMapper;

    public ExpenseCategoryResponse create(CreateExpenseCategoryRequest request) {
        if (expenseCategoryRepository.existsByName(request.getName())) {
            throw new ConflictException("Expense category with name '" + request.getName() + "' already exists");
        }

        ExpenseCategory expenseCategory = expenseCategoryMapper.toEntity(request);
        ExpenseCategory savedExpenseCategory = expenseCategoryRepository.save(expenseCategory);

        return expenseCategoryMapper.toResponse(savedExpenseCategory);
    }

    public List<ExpenseCategoryResponse> getAll() {
        List<ExpenseCategory> expenseCategories = expenseCategoryRepository.findAll();
        return expenseCategoryMapper.toResponseList(expenseCategories);
    }

    public ExpenseCategoryResponse update(UpdateExpenseCategoryRequest request) {
        ExpenseCategory expenseCategory = expenseCategoryRepository.findById(request.getId()).orElse(null);

        if (expenseCategory == null) {
            throw new NotFoundException("Expense category type not found");
        }

        if (!expenseCategory.getName().equals(request.getName()) && expenseCategoryRepository.existsByName(request.getName())) {
            throw new ConflictException("Expense category with name '" + request.getName() + "' already exists");
        }

        ExpenseCategory newDocumentType = expenseCategoryMapper.toEntity(request);
        ExpenseCategory savedDocumentType = expenseCategoryRepository.save(newDocumentType);

        return expenseCategoryMapper.toResponse(savedDocumentType);
    }

    public void delete(UUID id) {
        if (!expenseCategoryRepository.existsById(id)) {
            throw new NotFoundException("Expense category not found");
        }
        // TODO: soft delete
        expenseCategoryRepository.deleteById(id);
    }
}
