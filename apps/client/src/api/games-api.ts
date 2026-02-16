import { axiosClient } from '@/lib/axios-client';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

type GameSummary = components['schemas']['GameSummaryResponse'];
type Game = components['schemas']['GameResponse'];

type CreateGameRequest = components['schemas']['CreateGameRequest'];
type WaitAnySlotRequest = components['schemas']['WaitAnySlotRequest'];
type BookSlotRequest = components['schemas']['BookSlotRequest'];
type WaitSpecificSlotRequest = components['schemas']['WaitSpecificSlotRequest'];
type QueuedSlotActionRequest = components['schemas']['QueuedSlotActionRequest'];

export function useGetGames() {
    return useQuery({
        queryKey: ['games'],
        queryFn: async (): Promise<GameSummary[]> => {
            const { data } = await axiosClient.get<{ data?: GameSummary[] }>(
                '/games'
            );
            return data.data || [];
        },
    });
}

export function useGetGame(id?: string) {
    return useQuery({
        queryKey: ['game', id],
        queryFn: async (): Promise<Game | null> => {
            const { data } = await axiosClient.get<{ data?: Game }>(
                `/games/${id}`
            );
            return data.data ?? null;
        },
        enabled: !!id,
    });
}

export function useCreateGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateGameRequest): Promise<void> => {
            await axiosClient.post('/games', payload);
        },
        onSuccess: () => {
            toast.success('Game created');
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to create game'
            );
            console.error('Failed to create game', error);
        },
    });
}

export function useWaitForAnySlot(gameId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: WaitAnySlotRequest): Promise<void> => {
            await axiosClient.post(`/games/${gameId}/slots/wait`, payload);
        },
        onSuccess: () => {
            toast.success('Waiting for any slot');
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to wait for slot'
            );
            console.error('Failed to wait for slot', error);
        },
    });
}

export function useBookSlot(gameId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: BookSlotRequest): Promise<void> => {
            await axiosClient.post(`/games/${gameId}/slots/book`, payload);
        },
        onSuccess: () => {
            toast.success('Slot booked');
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Booking slot failed'
            );
            console.error('Booking slot failed', error);
        },
    });
}

export function useWaitForSpecificSlot(gameId: string, slotId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: WaitSpecificSlotRequest): Promise<void> => {
            await axiosClient.post(
                `/games/${gameId}/slots/${slotId}/wait`,
                payload
            );
        },
        onSuccess: () => {
            toast.success('Waiting for specific slot');
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to wait for specific slot'
            );
            console.error('Failed to wait for specific slot', error);
        },
    });
}

export function useSlotAction(gameId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            queuedSlotId: string;
            action: string;
            payload: QueuedSlotActionRequest;
        }): Promise<void> => {
            const { queuedSlotId, action, payload } = params;
            await axiosClient.post(
                `/games/${gameId}/slots/${queuedSlotId}/${action}`,
                payload
            );
        },
        onSuccess: () => {
            toast.success('Slot action performed');
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Slot action failed'
            );
            console.error('Slot action failed', error);
        },
    });
}
