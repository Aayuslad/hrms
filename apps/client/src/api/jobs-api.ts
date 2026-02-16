import { axiosClient } from '@/lib/axios-client';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

type JobOpeningSummary = components['schemas']['JobOpeningSummaryResponse'];
type JobOpening = components['schemas']['JobOpeningResponse'];

type CreateJobOpeningRequest = components['schemas']['CreateJobOpeningRequest'];
type UpdateJobOpeningRequest = components['schemas']['UpdateJobOpeningRequest'];

export function useGetJobOpenings() {
    return useQuery({
        queryKey: ['job-openings'],
        queryFn: async (): Promise<JobOpeningSummary[]> => {
            const { data } = await axiosClient.get<{
                data?: JobOpeningSummary[];
            }>('/job-openings');
            return data.data || [];
        },
    });
}

export function useGetJobOpening(id?: string) {
    return useQuery({
        queryKey: ['job-opening', id],
        queryFn: async (): Promise<JobOpening | null> => {
            const { data } = await axiosClient.get<{ data?: JobOpening }>(
                `/job-openings/${id}`
            );
            return data.data ?? null;
        },
        enabled: !!id,
    });
}

export function useCreateJobOpening() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateJobOpeningRequest): Promise<void> => {
            await axiosClient.post('/job-openings', payload);
        },
        onSuccess: () => {
            toast.success('Job opening created');
            queryClient.invalidateQueries({ queryKey: ['job-openings'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to create job opening'
            );
            console.error('Failed to create job opening', error);
        },
    });
}

export function useUpdateJobOpening() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (
            payload: UpdateJobOpeningRequest & { id: string }
        ): Promise<void> => {
            await axiosClient.put(`/job-openings/${payload.id}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: (_, vars) => {
            toast.success('Job opening updated');
            queryClient.invalidateQueries({ queryKey: ['job-openings'] });
            queryClient.invalidateQueries({
                queryKey: ['job-opening', vars.id],
            });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to update job opening'
            );
            console.error('Failed to update job opening', error);
        },
    });
}

export function useDeleteJobOpening() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.delete(`/job-openings/${id}`);
        },
        onSuccess: () => {
            toast.success('Job opening deleted');
            queryClient.invalidateQueries({ queryKey: ['job-openings'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to delete job opening'
            );
            console.error('Failed to delete job opening', error);
        },
    });
}
