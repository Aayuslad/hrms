import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import { handleApiError } from '@/lib/utils';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type TravelPlanSummary =
    components['schemas']['TravelPlanSummaryResponse'];
export type TravelPlan = components['schemas']['TravelPlanResponse'];
export type Participant = components['schemas']['ParticipantResponse'];
export type TravelPlanExpensesResponse =
    components['schemas']['TravelPlanExpensesResponse'];

export type TravelPlanDocument = NonNullable<Participant['documents']>[number];
export type TravelPlanExpense = NonNullable<Participant['expenses']>[number];

export type CreateTravelPlanRequest =
    components['schemas']['CreateTravelPlanRequest'];
export type UpdateTravelPlanRequest =
    components['schemas']['UpdateTravelPlanRequest'];

export type CreateExpenseRequest =
    components['schemas']['CreateExpenseRequest'];
export type UpdateExpenseRequest =
    components['schemas']['UpdateExpenseRequest'];
export type CreateDocumentRequest =
    components['schemas']['CreateDocumentRequest'];
export type UpdateDocumentRequest =
    components['schemas']['UpdateDocumentRequest'];
export type ApproveExpenseRequest =
    components['schemas']['ApproveExpenseRequest'];
export type RejectExpenseRequest =
    components['schemas']['RejectExpenseRequest'];

export type AddParticipantsRequest = components['schemas']['AddParticipantsRequest'];
export type RemoveParticipantsRequest = components['schemas']['RemoveParticipantsRequest'];

// get a list of travel plan
const travelPlansQuery = {
    queryKey: ['travel-plans'],
    queryFn: async (): Promise<TravelPlanSummary[]> => {
        const { data } = await axiosClient.get<{
            data?: TravelPlanSummary[];
        }>('/travel-plans');
        return data.data || [];
    },
};

export function useGetTravelPlans() {
    return useQuery<TravelPlanSummary[], AxiosError>(travelPlansQuery);
}

export const travelPlansLoader = async () => {
    return await queryClient.ensureQueryData(travelPlansQuery);
};

// get a detailed travel plan
const travelPlanQuery = (id?: string) => ({
    queryKey: ['travel-plan', id],
    queryFn: async (): Promise<TravelPlan | null> => {
        const { data } = await axiosClient.get<{ data?: TravelPlan }>(
            `/travel-plans/${id}`
        );
        return data.data ?? null;
    },
    enabled: !!id,
});

export function useGetTravelPlan(id?: string) {
    return useQuery(travelPlanQuery(id));
}

export const travelPlanLoader = async ({
    params,
}: {
    params: { travelPlanId?: string };
}) => {
    const id = params.travelPlanId;
    if (!id) {
        throw new Response('Game not found', { status: 404 });
    }
    return await queryClient.ensureQueryData(travelPlanQuery(id));
};

const travelPlanExpensesQuery = (id?: string) => ({
    queryKey: ['travel-plan-expenses', id],
    queryFn: async (): Promise<TravelPlanExpensesResponse> => {
        const { data } = await axiosClient.get<{
            data?: TravelPlanExpensesResponse;
        }>(`/travel-plans/${id}/expenses`);
        return data.data!;
    },
    enabled: !!id,
});

export function useGetTravelPlanExpenses(id?: string) {
    return useQuery(travelPlanExpensesQuery(id));
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
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to create travel plan'),
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
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to update travel plan'),
    });
}

export function useDeleteTravelPlan() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.delete(`/travel-plans/${id}`);
        },
        onSuccess: () => {
            toast.success('Travel plan deleted');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            navigate('/travel-plans');
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to delete travel plan'),
    });
}

export function useGetParticipant(
    travelPlanId?: string,
    participantId?: string
) {
    return useQuery({
        queryKey: ['travel-plan-participant', travelPlanId, participantId],
        queryFn: async (): Promise<Participant | null> => {
            const { data } = await axiosClient.get<{ data?: Participant }>(
                `/travel-plans/${travelPlanId}/participant/${participantId}`
            );
            return data.data ?? null;
        },
        enabled: !!travelPlanId && !!participantId,
    });
}

// ---- new hooks for managing participants --------------------------------------------------
export function useAddParticipants() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            travelPlanId: string;
            payload: AddParticipantsRequest;
        }): Promise<void> => {
            await axiosClient.post(
                `/travel-plans/${params.travelPlanId}/participants`,
                params.payload
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Participants added');
            queryClient.invalidateQueries({ queryKey: ['travel-plan', vars.travelPlanId] });
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to add participants'),
    });
}

export function useRemoveParticipants() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            travelPlanId: string;
            payload: RemoveParticipantsRequest;
        }): Promise<void> => {
            await axiosClient.delete(
                `/travel-plans/${params.travelPlanId}/participants`,
                { data: params.payload }
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Participants removed');
            queryClient.invalidateQueries({ queryKey: ['travel-plan', vars.travelPlanId] });
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to remove participants'),
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            payload: FormData | CreateExpenseRequest;
            travelPlanId: string;
            participantId: string;
        }): Promise<void> => {
            await axiosClient.post(
                `/travel-plans/${params.travelPlanId}/participant/${params.participantId}/expenses`,
                params.payload,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Expense created');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.travelPlanId,
                    vars.participantId,
                ],
            });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.travelPlanId],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to create expense'),
    });
}

export function useUpdateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            travelPlanId: string;
            participantId: string;
            expenseId: string;
            payload: UpdateExpenseRequest;
        }): Promise<void> => {
            const { travelPlanId, participantId, expenseId, payload } = params;
            await axiosClient.put(
                `/travel-plans/${travelPlanId}/participant/${participantId}/expenses/${expenseId}`,
                payload,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Expense updated');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.travelPlanId,
                    vars.participantId,
                ],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to update expense'),
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            travelPlanId: string;
            participantId: string;
            expenseId: string;
        }): Promise<void> => {
            const { travelPlanId, participantId, expenseId } = params;
            await axiosClient.delete(
                `/travel-plans/${travelPlanId}/participant/${participantId}/expenses/${expenseId}`
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Expense deleted');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.travelPlanId,
                    vars.participantId,
                ],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to delete expense'),
    });
}

export function useSubmitExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            travelPlanId: string;
            participantId: string;
            expenseId: string;
        }): Promise<void> => {
            const { travelPlanId, participantId, expenseId } = params;
            await axiosClient.patch(
                `/travel-plans/${travelPlanId}/participant/${participantId}/expenses/${expenseId}/submit`
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Expense submitted');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.travelPlanId,
                    vars.participantId,
                ],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to submit expense'),
    });
}

export function useCreateDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            travelPlanId: string;
            participantId: string;
            payload: CreateDocumentRequest;
        }): Promise<void> => {
            const { travelPlanId, participantId, payload } = params;
            await axiosClient.post(
                `/travel-plans/${travelPlanId}/participant/${participantId}/documents`,
                payload,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Document created');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.travelPlanId,
                    vars.participantId,
                ],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to create document'),
    });
}

export function useUpdateDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            travelPlanId: string;
            participantId: string;
            documentId: string;
            payload: UpdateDocumentRequest;
        }): Promise<void> => {
            const { travelPlanId, participantId, documentId, payload } = params;
            await axiosClient.put(
                `/travel-plans/${travelPlanId}/participant/${participantId}/documents/${documentId}`,
                payload,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Document updated');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.travelPlanId,
                    vars.participantId,
                ],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to update document'),
    });
}

export function useDeleteDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            travelPlanId: string;
            participantId: string;
            documentId: string;
        }): Promise<void> => {
            const { travelPlanId, participantId, documentId } = params;
            await axiosClient.delete(
                `/travel-plans/${travelPlanId}/participant/${participantId}/documents/${documentId}`
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Document deleted');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.travelPlanId,
                    vars.participantId,
                ],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to delete document'),
    });
}

export function useCreateDocumentByHr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            travelPlanId: string;
            participantId: string;
            payload: CreateDocumentRequest;
        }): Promise<void> => {
            const { travelPlanId, participantId, payload } = params;
            await axiosClient.post(
                `/travel-plans/${travelPlanId}/participant/${participantId}/documents/hr`,
                payload,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Document created by HR');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.travelPlanId,
                    vars.participantId,
                ],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to create document by HR'),
    });
}

export function useApproveExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            participantId: string;
            payload: ApproveExpenseRequest;
        }): Promise<void> => {
            await axiosClient.patch(
                `/travel-plans/${params.payload.travelPlanId}/participant/${params.participantId}/expenses/${params.payload.expenseId}/approve`,
                params.payload
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Expense approved');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.payload.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.payload.travelPlanId,
                    vars.participantId,
                ],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to approve expense'),
    });
}

export function useRejectExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: {
            participantId: string;
            payload: RejectExpenseRequest;
        }): Promise<void> => {
            await axiosClient.patch(
                `/travel-plans/${params.payload.travelPlanId}/participant/${params.participantId}/expenses/${params.payload.expenseId}/reject`,
                params.payload
            );
        },
        onSuccess: (_, vars) => {
            toast.success('Expense rejected');
            queryClient.invalidateQueries({ queryKey: ['travel-plans'] });
            queryClient.invalidateQueries({
                queryKey: ['travel-plan', vars.payload.travelPlanId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'travel-plan-participant',
                    vars.payload.travelPlanId,
                    vars.participantId,
                ],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to reject expense'),
    });
}
