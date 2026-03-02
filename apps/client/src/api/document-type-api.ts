import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import { handleApiError } from '@/lib/utils';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export type DocumentType = components['schemas']['DocumentTypeResponse'];
export type CreateDocumentTypeRequest =
    components['schemas']['CreateDocumentTypeRequest'];
export type UpdateDocumentTypeRequest =
    components['schemas']['UpdateDocumentTypeRequest'];

const documentTypesQuery = {
    queryKey: ['document-types'] as const,
    queryFn: async (): Promise<DocumentType[]> => {
        const { data } = await axiosClient.get<{ data?: DocumentType[] }>(
            '/document-types'
        );
        return data.data || [];
    },
};

export function useGetDocumentTypes() {
    return useQuery<DocumentType[], AxiosError>(documentTypesQuery);
}

export const documentTypesLoader = async () => {
    return await queryClient.ensureQueryData(documentTypesQuery);
};

export function useCreateDocumentType() {
    return useMutation({
        mutationFn: async (
            payload: CreateDocumentTypeRequest
        ): Promise<void> => {
            await axiosClient.post('/document-types', payload);
        },
        onSuccess: () => {
            toast.success('Document type created');
            queryClient.invalidateQueries({ queryKey: ['document-types'] });
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to create document type'),
    });
}

export function useUpdateDocumentType() {
    return useMutation({
        mutationFn: async (
            payload: UpdateDocumentTypeRequest
        ): Promise<void> => {
            await axiosClient.put(`/document-types/${payload.id}`, payload);
        },
        onSuccess: () => {
            toast.success('Document type updated');
            queryClient.invalidateQueries({ queryKey: ['document-types'] });
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to update document type'),
    });
}

export function useDeleteDocumentType() {
    return useMutation({
        mutationFn: async (gameId: string): Promise<void> => {
            await axiosClient.delete(`/document-types/${gameId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document-types'] });
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to delete document type'),
    });
}
