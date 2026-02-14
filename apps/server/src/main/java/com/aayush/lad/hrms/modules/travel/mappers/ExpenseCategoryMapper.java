package com.aayush.lad.hrms.modules.travel.mappers;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.read.ExpenseCategoryResponse;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.write.CreateExpenseCategoryRequest;
import com.aayush.lad.hrms.modules.travel.dtos.expense_category.write.UpdateExpenseCategoryRequest;
import com.aayush.lad.hrms.modules.travel.models.ExpenseCategory;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExpenseCategoryMapper {

    private final ModelMapper modelMapper;
    private final CurrentUserService currentUserService;

    public ExpenseCategory create(CreateExpenseCategoryRequest request) {
        ExpenseCategory category = modelMapper.map(request, ExpenseCategory.class);
        category.setCreatedBy(currentUserService.getCurrentUserEntity());
        return category;
    }

    public void update(UpdateExpenseCategoryRequest request, ExpenseCategory existing) {
        modelMapper.map(request, existing);
        existing.setUpdatedBy(currentUserService.getCurrentUserEntity());
    }

    public ExpenseCategoryResponse toResponse(ExpenseCategory expenseCategory) {
        return modelMapper.map(expenseCategory, ExpenseCategoryResponse.class);
    }

    public List<ExpenseCategoryResponse> toResponseList(List<ExpenseCategory> expenseCategories) {
        return expenseCategories.stream()
                .map(this::toResponse)
                .toList();
    }
}
