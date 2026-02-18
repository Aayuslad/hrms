import { axiosClient } from '@/lib/axios-client';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export type TravelPlanSummary = components['schemas']['TravelPlanSummaryResponse'];
export type TravelPlan = components['schemas']['TravelPlanResponse'];

export type CreateTravelPlanRequest = components['schemas']['CreateTravelPlanRequest'];
export type UpdateTravelPlanRequest = components['schemas']['UpdateTravelPlanRequest'];

export function useGetTravelPlans() {
    return useQuery({
        queryKey: ['travel-plans'],
        queryFn: async (): Promise<TravelPlanSummary[]> => {
            const { data } = await axiosClient.get<{
                data?: TravelPlanSummary[];
            }>('/travel-plans');
            return data.data || [];
        },
    });
}

export function useGetTravelPlan(id?: string) {
    return useQuery({
        queryKey: ['travel-plan', id],
        queryFn: async (): Promise<TravelPlan | null> => {
            const { data } = await axiosClient.get<{ data?: TravelPlan }>(
                `/travel-plans/${id}`
            );
            return data.data ?? null;
        },
        enabled: !!id,
    });
}

export function useCreateTravelPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateTravelPlanRequest): Promise<void> => {
            await axiosClient.post('/travel-plans', payload);
        },
        onSuccess: () => {
            toast.success('Travel plan created');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to create travel plan'
            );
            console.error('Failed to create travel plan', error);
        },
    });
}

export function useUpdateTravelPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (
            payload: UpdateTravelPlanRequest & { id: string }
        ): Promise<void> => {
            await axiosClient.put(`/travel-plans/${payload.id}`, payload);
        },
        onSuccess: (_, vars) => {
            toast.success('Travel plan updated');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.id],
            });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to update travel plan'
            );
            console.error('Failed to update travel plan', error);
        },
    });
}

export function useDeleteTravelPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.delete(`/travel-plans/${id}`);
        },
        onSuccess: () => {
            toast.success('Travel plan deleted');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to delete travel plan'
            );
            console.error('Failed to delete travel plan', error);
        },
    });
}
