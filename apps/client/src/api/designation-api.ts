import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export type Designation = components['schemas']['DesignationResponse'];
export type CreateDesignationRequest =
    components['schemas']['CreateDesignationRequest'];
export type UpdateDesignationRequest =
    components['schemas']['UpdateDesignationRequest'];

const designationsQuery = {
    queryKey: ['designations'] as const,
    queryFn: async (): Promise<Designation[]> => {
        const { data } = await axiosClient.get<{ data?: Designation[] }>(
            '/designations'
        );
        return data.data || [];
    },
};

export function useGetDesignations() {
    return useQuery<Designation[], AxiosError>(designationsQuery);
}

export const designationsLoader = async () => {
    return await queryClient.ensureQueryData(designationsQuery);
};

export function useCreateDesignation() {
    return useMutation({
        mutationFn: async (
            payload: CreateDesignationRequest
        ): Promise<void> => {
            await axiosClient.post('/designations', payload);
        },
        onSuccess: () => {
            toast.success('Designation created');
            queryClient.invalidateQueries({ queryKey: ['designations'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to create Designation'
            );
            console.error('Failed to create designation', error);
        },
    });
}

export function useUpdateDesignation() {
    return useMutation({
        mutationFn: async (
            payload: UpdateDesignationRequest
        ): Promise<void> => {
            await axiosClient.put(`/designations/${payload.id}`, payload);
        },
        onSuccess: () => {
            toast.success('Designation updated');
            queryClient.invalidateQueries({ queryKey: ['designations'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to update designation'
            );
            console.error('Failed to update designation', error);
        },
    });
}

export function useDeleteDesignation() {
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.delete(`/designations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['designations'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to delete designation'
            );
            console.error('Failed to delete designation', error);
        },
    });
}
