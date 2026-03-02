import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import { handleApiError } from '@/lib/utils';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type GameSummary = components['schemas']['GameSummaryResponse'];
export type Game = components['schemas']['GameResponse'];

export type CreateGameRequest = components['schemas']['CreateGameRequest'];
export type UpdateGameRequest = components['schemas']['UpdateGameRequest'];
export type WaitAnySlotRequest = components['schemas']['WaitAnySlotRequest'];
export type BookSlotRequest = components['schemas']['BookSlotRequest'];
export type WaitSpecificSlotRequest =
    components['schemas']['WaitSpecificSlotRequest'];
export type QueuedSlotActionRequest =
    components['schemas']['QueuedSlotActionRequest'];
export type QueuedSlotOffer = components['schemas']['QueuedSlotOfferResponse'];

// get a list of games
const gamesQuery = {
    queryKey: ['games'] as const,
    queryFn: async (): Promise<GameSummary[]> => {
        const { data } = await axiosClient.get<{ data?: GameSummary[] }>(
            '/games'
        );
        return data.data || [];
    },
};

export function useGetGames() {
    return useQuery<GameSummary[], AxiosError>(gamesQuery);
}

export const gamesLoader = async () => {
    return await queryClient.ensureQueryData(gamesQuery);
};

// get a detailed game
const gameQuery = (id?: string) => ({
    queryKey: ['game', id] as const,
    queryFn: async (): Promise<Game | null> => {
        const { data } = await axiosClient.get<{ data?: Game }>(`/games/${id}`);
        return data.data ?? null;
    },
    enabled: !!id,
});

export function useGetGame(id?: string) {
    return useQuery(gameQuery(id));
}

export const gameLoader = async ({
    params,
}: {
    params: { gameId?: string };
}) => {
    const id = params.gameId;
    if (!id) {
        throw new Response('Game not found', { status: 404 });
    }
    return await queryClient.ensureQueryData(gameQuery(id));
};

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
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to create game'),
    });
}

export function useUpdateGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateGameRequest): Promise<void> => {
            await axiosClient.put(`/games/${payload.id}`, payload);
        },
        onSuccess: (_, payload) => {
            toast.success('Game updated');
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({ queryKey: ['game', payload.id] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to update game'),
    });
}

export function useDeleteGame() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (gameId: string): Promise<void> => {
            await axiosClient.delete(`/games/${gameId}`);
        },
        onSuccess: (_, gameId) => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({ queryKey: ['game', gameId] });
            navigate('/games');
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to delete game'),
    });
}

export function useWaitForAnySlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: WaitAnySlotRequest): Promise<void> => {
            await axiosClient.post(
                `/games/${payload.gameId}/slots/wait`,
                payload
            );
        },
        onSuccess: (_, payload) => {
            toast.success('Waiting for any slot');
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({
                queryKey: ['game', payload.gameId],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to wait for slot'),
    });
}

export function useBookSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: BookSlotRequest): Promise<void> => {
            await axiosClient.post(
                `/games/${payload.gameId}/slots/book`,
                payload
            );
        },
        onSuccess: (_, payload) => {
            toast.success('Slot booked');
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({
                queryKey: ['game', payload.gameId],
            });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Booking slot failed'),
    });
}

export function useWaitForSpecificSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: WaitSpecificSlotRequest): Promise<void> => {
            await axiosClient.post(
                `/games/${payload.gameId}/slots/${payload.slotId}/wait`,
                payload
            );
        },
        onSuccess: (_, { gameId }) => {
            toast.success('Waiting for specific slot');
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({ queryKey: ['game', gameId] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to wait for specific slot'),
    });
}

export function useSlotAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            queuedSlotId: string;
            action: string;
            payload: QueuedSlotActionRequest;
        }): Promise<void> => {
            const { queuedSlotId, action, payload } = params;
            await axiosClient.post(
                `/games/slots/${queuedSlotId}/${action}`,
                payload
            );
        },
        onSuccess: (_, gameId) => {
            toast.success('Slot action performed');
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({ queryKey: ['game', gameId] });
            queryClient.invalidateQueries({ queryKey: ['game-offers'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Slot action failed'),
    });
}

const offersQuery = {
    queryKey: ['game-offers'] as const,
    queryFn: async (): Promise<QueuedSlotOffer[]> => {
        const { data } = await axiosClient.get<{ data?: QueuedSlotOffer[] }>(
            '/games/offers'
        );
        return data.data || [];
    },
};

export function useGetOffers() {
    return useQuery<QueuedSlotOffer[], AxiosError>(offersQuery);
}

export const offersLoader = async () => {
    return await queryClient.ensureQueryData(offersQuery);
};

export function useCancelSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            gameId: string;
            slotId: string;
        }): Promise<void> => {
            const { gameId, slotId } = params;
            await axiosClient.patch(`/games/${gameId}/slots/${slotId}/cancel`);
        },
        onSuccess: (_, { gameId }) => {
            toast.success('Slot cancelled');
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({ queryKey: ['game', gameId] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to cancel slot'),
    });
}
