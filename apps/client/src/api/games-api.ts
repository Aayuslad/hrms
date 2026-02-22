import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import type { components } from '@/types/generated/api';
import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';
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
const gameQuery = (id: string) => ({
    queryKey: ['game', id] as const,
    queryFn: async (): Promise<Game | null> => {
        const { data } = await axiosClient.get<{ data?: Game }>(`/games/${id}`);
        return data.data ?? null;
    },
});

export function useGetGame(id?: string) {
    return useQuery<Game | null, AxiosError>({
        ...gameQuery(id ?? ''),
        enabled: !!id,
    });
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
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to create game'
            );
            console.error('Failed to create game', error);
        },
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
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to update game'
            );
            console.error('Failed to update game', error);
        },
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
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to delete game'
            );
            console.error('Failed to delete game', error);
        },
    });
}

export function useWaitForAnySlot(gameId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: WaitAnySlotRequest): Promise<void> => {
            await axiosClient.post(`/games/${gameId}/slots/wait`, payload);
        },
        onSuccess: (_, gameId) => {
            toast.success('Waiting for any slot');
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({ queryKey: ['game', gameId] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to wait for slot'
            );
            console.error('Failed to wait for slot', error);
        },
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
            queryClient.invalidateQueries({ queryKey: ['game', payload.gameId] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
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
        onSuccess: (_, { gameId }) => {
            toast.success('Waiting for specific slot');
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({ queryKey: ['game', gameId] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
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
        onSuccess: (_, gameId) => {
            toast.success('Slot action performed');
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({ queryKey: ['game', gameId] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Slot action failed'
            );
            console.error('Slot action failed', error);
        },
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
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to cancel slot'
            );
            console.error('Failed to cancel slot', error);
        },
    });
}

export function useOfferAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            offerId: string;
            action: string;
            payload: QueuedSlotActionRequest;
        }): Promise<void> => {
            const { offerId, action, payload } = params;
            await axiosClient.post(
                `/games/offers/${offerId}/${action}`,
                payload
            );
        },
        onSuccess: () => {
            toast.success('Offer action performed');
            queryClient.invalidateQueries({ queryKey: ['game-offers'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Offer action failed'
            );
            console.error('Offer action failed', error);
        },
    });
}
