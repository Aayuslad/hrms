import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export type JobOpeningSummary =
    components['schemas']['JobOpeningSummaryResponse'];
export type JobOpening = components['schemas']['JobOpeningResponse'];
export type JobOpeningReferralResponse =
    components['schemas']['JobOpeningReferralResponse'];

export type CreateJobOpeningRequest =
    components['schemas']['CreateJobOpeningRequest'];
export type UpdateJobOpeningRequest =
    components['schemas']['UpdateJobOpeningRequest'];
export type ShareJobOpeningRequest =
    components['schemas']['ShareJobOpeningRequest'];
export type CreateJobOpeningReferralRequest =
    components['schemas']['CreateJobOpeningReferralRequest'];
export type UpdateJobOpeningReferralRequest =
    components['schemas']['UpdateJobOpeningReferralRequest'];

const jobsQuery = {
    queryKey: ['job-openings'],
    queryFn: async (): Promise<JobOpeningSummary[]> => {
        const { data } = await axiosClient.get<{
            data?: JobOpeningSummary[];
        }>('/job-openings');
        return data.data || [];
    },
};

export function useGetJobOpenings() {
    return useQuery<JobOpeningSummary[], AxiosError>(jobsQuery);
}

export const jobOpeningsLoader = async () => {
    return await queryClient.ensureQueryData(jobsQuery);
};

const jobOpeningQuery = (id: string) => ({
    queryKey: ['job-opening', id],
    queryFn: async (): Promise<JobOpening | null> => {
        const { data } = await axiosClient.get<{ data?: JobOpening }>(
            `/job-openings/${id}`
        );
        return data.data ?? null;
    },
    enabled: !!id,
});

export function useGetJobOpening(id?: string) {
    return useQuery<JobOpening | null, AxiosError>({
        ...jobOpeningQuery(id ?? ''),
        enabled: !!id,
    });
}

export const jobOpeningLoader = async ({
    params,
}: {
    params: { jobOpeningId?: string };
}) => {
    const id = params.jobOpeningId;
    if (!id) {
        throw new Response('Job opening not found', { status: 404 });
    }
    return await queryClient.ensureQueryData(jobOpeningQuery(id));
};

export function useCreateJobOpening() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: FormData): Promise<void> => {
            await axiosClient.post('/job-openings', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
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
        onSuccess: (_, id) => {
            toast.success('Job opening deleted');
            queryClient.invalidateQueries({ queryKey: ['job-openings'] });
            queryClient.invalidateQueries({ queryKey: ['job-opening', id] });
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

export function useShareJobOpening() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            id: string;
            payload: ShareJobOpeningRequest;
        }): Promise<void> => {
            const { id, payload } = params;
            await axiosClient.post(`/job-openings/${id}/share`, payload);
        },
        onSuccess: () => {
            toast.success('Job opening shared');
            queryClient.invalidateQueries({ queryKey: ['job-openings'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to share job opening'
            );
            console.error('Failed to share job opening', error);
        },
    });
}

export function useCloseJobOpening() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.patch(`/job-openings/${id}/close`);
        },
        onSuccess: (_, id) => {
            toast.success('Job opening closed');
            queryClient.invalidateQueries({ queryKey: ['job-openings'] });
            queryClient.invalidateQueries({ queryKey: ['job-opening', id] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to close job opening'
            );
            console.error('Failed to close job opening', error);
        },
    });
}

export function useCreateJobOpeningReferral() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (
            payload: CreateJobOpeningReferralRequest
        ): Promise<void> => {
            await axiosClient.post('/job-openings/referrals', payload);
        },
        onSuccess: (_, vars) => {
            toast.success('Job opening referral created');
            queryClient.invalidateQueries({ queryKey: ['job-openings'] });
            queryClient.invalidateQueries({
                queryKey: ['job-opening', vars.jobOpeningId],
            });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to create job opening referral'
            );
            console.error('Failed to create job opening referral', error);
        },
    });
}

export function useUpdateJobOpeningReferral() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            jobOpeningId: string;
            referralId: string;
            payload: UpdateJobOpeningReferralRequest;
        }): Promise<void> => {
            const { jobOpeningId, referralId, payload } = params;
            await axiosClient.put(
                `/job-openings/${jobOpeningId}/refferals/${referralId}`,
                payload
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Job opening referral updated');
            queryClient.invalidateQueries({ queryKey: ['job-openings'] });
            queryClient.invalidateQueries({
                queryKey: ['job-opening', vars.jobOpeningId],
            });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to update job opening referral'
            );
            console.error('Failed to update job opening referral', error);
        },
    });
}
