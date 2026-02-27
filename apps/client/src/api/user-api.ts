import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import { handleApiError } from '@/lib/utils';
import { useAppStore } from '@/store';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export type User = components['schemas']['UserDetailResponse'];
export type UserSummary = components['schemas']['GlobalUserResponseSummary'];
export type OrgChartType = OrgChartNodeType[];
export type OrgChartNodeType =
    components['schemas']['EmployeeOrgChartNodeResponse'];
export type Notification = components['schemas']['NotificationResponse'];

export type LoginUserRequest = components['schemas']['LoginUserRequest'];
export type RegisterUserRequest = components['schemas']['RegisterUserRequest'];
export type CreateUserProfileRequest =
    components['schemas']['CreateUserProfileRequest'];
export type UpdateUserByAdminRequest =
    components['schemas']['UpdateUserByAdminRequest'];
export type UpdateUserRolesRequest =
    components['schemas']['UpdateUserRolesRequest'];
export type UpdateUserBySelfRequest =
    components['schemas']['UpdateUserBySelfRequest'];

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

export function useMarkNotificationsAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notificationIds: string[]): Promise<void> => {
            await axiosClient.put('/users/me/notifications/mark-as-read', {
                notificationIds,
            });
        },
        onSuccess: () => {
            toast.success('Notifications marked as read!');
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to mark notifications as read'),
    });
}

const orgChartQuery = (userId?: string) => ({
    queryKey: ['org-charts', userId] as const,
    queryFn: async (): Promise<OrgChartType> => {
        const { data } = await axiosClient.get(
            `users/org-charts?userId=${userId}`
        );
        return data.data.orgCharts || [];
    },
    enabled: !!userId,
});

export function useGetOrgCharts(userId?: string) {
    return useQuery<OrgChartType, AxiosError>(orgChartQuery(userId));
}

export const orgChartsLoader = async (userId: string) => {
    return await queryClient.ensureQueryData(orgChartQuery(userId));
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
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Login failed'),
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
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Register failed'),
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
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Profile creation failed'),
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
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Logout failed'),
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
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to update user'),
    });
}

export function useUpdateUserBySelf() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateUserBySelfRequest): Promise<void> => {
            await axiosClient.put('/users/me', payload);
        },
        onSuccess: () => {
            toast.success('Profile updated!');
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to update profile'),
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
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: AxiosError<{ message: string }>) =>
            handleApiError(error, 'Failed to update user roles'),
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
