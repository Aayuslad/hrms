import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export type Tag = components['schemas']['TagResponse'];
export type CreateTagRequest = components['schemas']['CreateTagRequest'];
export type UpdateTagRequest = components['schemas']['UpdateTagRequest'];

const tagsQuery = {
    queryKey: ['tags'] as const,
    queryFn: async (): Promise<Tag[]> => {
        const { data } = await axiosClient.get<{ data?: Tag[] }>(
            '/engagement/tags'
        );
        return data.data || [];
    },
};

export function useGetTags() {
    return useQuery<Tag[], AxiosError>(tagsQuery);
}

export const tagsLoader = async () => {
    return await queryClient.ensureQueryData(tagsQuery);
};

export function useGetTag(id: string) {
    return useQuery<Tag, AxiosError>({
        queryKey: ['tags', id],
        queryFn: async (): Promise<Tag> => {
            const { data } = await axiosClient.get<{ data?: Tag }>(
                `/engagement/tags/${id}`
            );
            return data.data!;
        },
        enabled: !!id,
    });
}

export function useCreateTag() {
    return useMutation({
        mutationFn: async (payload: CreateTagRequest): Promise<void> => {
            await axiosClient.post('/engagement/tags', payload);
        },
        onSuccess: () => {
            toast.success('Tag created');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to create tag'
            );
            console.error('Failed to create tag', error);
        },
    });
}

export function useUpdateTag() {
    return useMutation({
        mutationFn: async (payload: UpdateTagRequest): Promise<void> => {
            await axiosClient.put(`/engagement/tags/${payload.id}`, payload);
        },
        onSuccess: () => {
            toast.success('Tag updated');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to update tag'
            );
            console.error('Failed to update tag', error);
        },
    });
}

export function useDeleteTag() {
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.delete(`/engagement/tags/${id}`);
        },
        onSuccess: () => {
            toast.success('Tag deleted');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to delete tag'
            );
            console.error('Failed to delete tag', error);
        },
    });
}