import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import { handleApiError } from '@/lib/utils';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export type Department = components['schemas']['DepartmentResponse'];
export type CreateDepartmentRequest =
    components['schemas']['CreateDepartmentRequest'];
export type UpdateDepartmentRequest =
    components['schemas']['UpdateDepartmentRequest'];

const departmentsQuery = {
    queryKey: ['departments'] as const,
    queryFn: async (): Promise<Department[]> => {
        const { data } = await axiosClient.get<{ data?: Department[] }>(
            '/departments'
        );
        return data.data || [];
    },
};

export function useGetDepartmentes() {
    return useQuery<Department[], AxiosError>(departmentsQuery);
}

export const departmentsLoader = async () => {
    return await queryClient.ensureQueryData(departmentsQuery);
};

export function useCreateDepartment() {
    return useMutation({
        mutationFn: async (payload: CreateDepartmentRequest): Promise<void> => {
            await axiosClient.post('/departments', payload);
        },
        onSuccess: () => {
            toast.success('Department created');
            queryClient.invalidateQueries({ queryKey: ['departments'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to create department'),
    });
}

export function useUpdateDepartment() {
    return useMutation({
        mutationFn: async (payload: UpdateDepartmentRequest): Promise<void> => {
            await axiosClient.put(`/departments/${payload.id}`, payload);
        },
        onSuccess: () => {
            toast.success('Department updated');
            queryClient.invalidateQueries({ queryKey: ['departments'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to update department'),
    });
}

export function useDeleteDepartment() {
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.delete(`/departments/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to delete department'),
    });
}
