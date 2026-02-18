import { axiosClient } from '@/lib/axios-client';
import type { components } from '@/types/generated/api';
import {
    useMutation,
    useQuery,
    useQueryClient,
    type QueryClient,
    type UseQueryOptions,
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

export const gamesQuery = () => ({
    queryKey: ['games'] as const,
    queryFn: async (): Promise<GameSummary[]> => {
        const { data } = await axiosClient.get<{ data?: GameSummary[] }>(
            '/games'
        );
        return data.data || [];
    },
});

export const gameQuery = (id: string) => ({
    queryKey: ['game', id] as const,
    queryFn: async (): Promise<Game | null> => {
        const { data } = await axiosClient.get<{ data?: Game }>(`/games/${id}`);
        return data.data ?? null;
    },
});

export function useGetGames(
    options?: Omit<
        UseQueryOptions<GameSummary[], AxiosError>,
        'queryKey' | 'queryFn'
    >
) {
    return useQuery<GameSummary[], AxiosError>({
        ...gamesQuery(),
        ...options,
    });
}

export function useGetGame(
    id?: string,
    options?: Omit<
        UseQueryOptions<Game | null, AxiosError>,
        'queryKey' | 'queryFn' | 'enabled'
    >
) {
    return useQuery<Game | null, AxiosError>({
        ...gameQuery(id ?? ''),
        enabled: !!id,
        ...options,
    });
}

export const gamesLoader = (queryClient: QueryClient) => async () => {
    return await queryClient.ensureQueryData(gamesQuery());
};

export const gameLoader =
    (queryClient: QueryClient) =>
    async ({ params }: { params: { gameId?: string } }) => {
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
        onSuccess: () => {
            toast.success('Waiting for any slot');
            queryClient.invalidateQueries({ queryKey: ['games'] });
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
        onSuccess: () => {
            toast.success('Slot booked');
            queryClient.invalidateQueries({ queryKey: ['games'] });
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
        onSuccess: () => {
            toast.success('Waiting for specific slot');
            queryClient.invalidateQueries({ queryKey: ['games'] });
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
        onSuccess: () => {
            toast.success('Slot action performed');
            queryClient.invalidateQueries({ queryKey: ['games'] });
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
