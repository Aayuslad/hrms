import { axiosClient } from '@/lib/axios-client';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type User = components['schemas']['UserDetailResponse'];
export type UserSummary = components['schemas']['UserSummaryResponse'];

export type LoginUserRequest = components['schemas']['LoginUserRequest'];
export type RegisterUserRequest = components['schemas']['RegisterUserRequest'];
export type CreateUserProfileRequest =
    components['schemas']['CreateUserProfileRequest'];
export type UpdateUserByAdminRequest =
    components['schemas']['UpdateUserByAdminRequest'];
export type UpdateUserRolesRequest =
    components['schemas']['UpdateUserRolesRequest'];

export function useGetUserById(id?: string) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async (): Promise<User | null> => {
            const { data } = await axiosClient.get<{ data?: User }>(
                `/users/${id}`
            );
            return data.data ?? null;
        },
        enabled: !!id,
    });
}

export function useGetMe() {
    const navigate = useNavigate();

    return useQuery({
        queryKey: ['me'],
        queryFn: async (): Promise<User | undefined | null> => {
            try {
                const { data } = await axiosClient.get<{ data?: User }>(
                    '/users/me'
                );
                if (!data.data?.profile) {
                    navigate('/create-user-profile');
                }
                return data.data ?? null;
            } catch (error) {
                console.log(error);
                navigate('/login');
            }
        },
    });
}

export function useGetUserList() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async (): Promise<UserSummary[]> => {
            const { data } = await axiosClient.get<{ data?: UserSummary[] }>(
                '/users/me'
            );
            return data.data ?? [];
        },
    });
}

export function useLoginUser() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (payload: LoginUserRequest): Promise<void> => {
            await axiosClient.post('/users/login', payload);
        },
        onSuccess: () => {
            toast.success('Logged in!');
            queryClient.invalidateQueries({ queryKey: ['me'] });
            navigate('/home');
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error || error.message || 'Login failed'
            );
            console.error('login failed', error);
        },
    });
}

export function useRegisterUser() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (payload: RegisterUserRequest): Promise<void> => {
            await axiosClient.post('/users/register', payload);
        },
        onSuccess: () => {
            toast.success('Registered!');
            queryClient.invalidateQueries({ queryKey: ['me'] });
            navigate('/create-user-profile');
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Register failed'
            );
            console.error('register failed', error);
        },
    });
}

export function useCreateUserProfile() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (
            payload: CreateUserProfileRequest
        ): Promise<void> => {
            await axiosClient.post('/users/profile', payload);
        },
        onSuccess: () => {
            toast.success('Profile created!');
            queryClient.invalidateQueries({ queryKey: ['me'] });
            navigate('/home');
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(
                error.response?.data?.error ||
                    error.message ||
                    'Profile creation failed'
            );
            console.error('Profile creatio failed', error);
        },
    });
}

export function useLogoutUser() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (): Promise<void> => {
            await axiosClient.post('/users/logout');
        },
        onSuccess: () => {
            queryClient.clear();
            navigate('/login');
        },
    });
}

export function useUpdateUserByAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            id: string;
            payload: UpdateUserByAdminRequest;
        }): Promise<void> => {
            await axiosClient.put(`/users/${params.id}`, undefined, {
                params: { request: params.payload },
            });
        },
        onSuccess: () => {
            toast.success('User updated!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            console.error('update user failed', error);
        },
    });
}

export function useEditUserRoles() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            userId: string;
            payload: UpdateUserRolesRequest;
        }): Promise<void> => {
            await axiosClient.put(
                `/users/${params.userId}/roles`,
                params.payload
            );
        },
        onSuccess: () => {
            toast.success('User roles updated!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            console.error('update roles failed', error);
        },
    });
}
