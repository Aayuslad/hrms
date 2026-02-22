import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export type ExpenseCategory = components['schemas']['ExpenseCategoryResponse'];
export type CreateExpenseCategoryRequest =
    components['schemas']['CreateExpenseCategoryRequest'];
export type UpdateExpenseCategoryRequest =
    components['schemas']['UpdateExpenseCategoryRequest'];

const expenseCategoriesQuery = {
    queryKey: ['expense-categories'] as const,
    queryFn: async (): Promise<ExpenseCategory[]> => {
        const { data } = await axiosClient.get<{ data?: ExpenseCategory[] }>(
            '/expense-categories'
        );
        return data.data || [];
    },
};

export function useGetExpenseCategories() {
    return useQuery<ExpenseCategory[], AxiosError>(expenseCategoriesQuery);
}

export const expenseCategoriesLoader = async () => {
    return await queryClient.ensureQueryData(expenseCategoriesQuery);
};

export function useCreateExpenseCategory() {
    return useMutation({
        mutationFn: async (
            payload: CreateExpenseCategoryRequest
        ): Promise<void> => {
            await axiosClient.post('/expense-categories', payload);
        },
        onSuccess: () => {
            toast.success('Expense category created');
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to create expense category'
            );
            console.error('Failed to create expense category', error);
        },
    });
}

export function useUpdateExpenseCategory() {
    return useMutation({
        mutationFn: async (
            payload: UpdateExpenseCategoryRequest
        ): Promise<void> => {
            await axiosClient.put(`/expense-categories/${payload.id}`, payload);
        },
        onSuccess: () => {
            toast.success('Expense category updated');
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to update expense category'
            );
            console.error('Failed to update expense category', error);
        },
    });
}

export function useDeleteExpenseCategory() {
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.delete(`/expense-categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to delete expense category'
            );
            console.error('Failed to delete expense category', error);
        },
    });
}
