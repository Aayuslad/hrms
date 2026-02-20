import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import { useAppStore } from '@/store';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export type User = components['schemas']['UserDetailResponse'];
export type UserSummary = components['schemas']['UserSummaryResponse'];
export type OrgChartType = OrgChartNodeType[];
export type OrgChartNodeType =
    components['schemas']['EmployeeOrgChartNodeResponse'];

export type LoginUserRequest = components['schemas']['LoginUserRequest'];
export type RegisterUserRequest = components['schemas']['RegisterUserRequest'];
export type CreateUserProfileRequest =
    components['schemas']['CreateUserProfileRequest'];
export type UpdateUserByAdminRequest =
    components['schemas']['UpdateUserByAdminRequest'];
export type UpdateUserRolesRequest =
    components['schemas']['UpdateUserRolesRequest'];
export type Notification = components['schemas']['NotificationResponse'];

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
    const { setUserRoles } = useAppStore(
        useShallow((s) => ({
            setUserRoles: s.setUserRoles,
        }))
    );

    return useQuery({
        queryKey: ['me'],
        queryFn: async (): Promise<User | undefined | null> => {
            try {
                const { data } = await axiosClient.get<{ data?: User }>(
                    '/users/me'
                );
                setUserRoles(
                    data?.data?.roles?.length
                        ? data?.data?.roles?.map((roles) => roles.name ?? '')
                        : []
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
                '/users/summary'
            );
            return data.data ?? [];
        },
    });
}

const notificationsQuery = {
    queryKey: ['notifications'] as const,
    queryFn: async (): Promise<Notification[]> => {
        const { data } = await axiosClient.get<{ data?: Notification[] }>(
            'users/me/notifications'
        );
        return data.data || [];
    },
};

export function useGetNotificationns() {
    return useQuery<Notification[], AxiosError>(notificationsQuery);
}

export const notificationsLoader = async () => {
    return await queryClient.ensureQueryData(notificationsQuery);
};

const orgChartQuery = {
    queryKey: ['org-charts'] as const,
    queryFn: async (): Promise<OrgChartType> => {
        const { data } = await axiosClient.get('users/org-charts');
        return data.data.orgCharts || [];
    },
};

export function useGetOrgCharts() {
    return useQuery<OrgChartType, AxiosError>(orgChartQuery);
}

export const orgChartsLoader = async () => {
    return await queryClient.ensureQueryData(orgChartQuery);
};

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
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message || error.message || 'Login failed'
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
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
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
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Profile creation failed'
            );
            console.error('Profile creation failed', error);
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
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Logout failed'
            );
            console.error('logout failed', error);
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
            await axiosClient.put(`/users/${params.id}`, params.payload);
        },
        onSuccess: () => {
            toast.success('User updated!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to update user'
            );
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
            queryClient.invalidateQueries({ queryKey: ['users-details'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to update user roles'
            );
            console.error('update roles failed', error);
        },
    });
}

/// all the employees details, for admin use only
export function useGetAllUsersDetails() {
    return useQuery({
        queryKey: ['users-details'],
        queryFn: async (): Promise<User[]> => {
            const { data } = await axiosClient.get<{ data?: User[] }>(
                '/users/details'
            );
            return data.data ?? [];
        },
    });
}
