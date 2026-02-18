import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import type { components } from '@/types/generated/api';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export type Role = components['schemas']['RoleResponse'];

const rolesQuery = {
    queryKey: ['roles'] as const,
    queryFn: async (): Promise<Role[]> => {
        const { data } = await axiosClient.get<{ data?: Role[] }>('/roles');
        return data.data || [];
    },
};

export function useGetRoles() {
    return useQuery<Role[], AxiosError>(rolesQuery);
}

export const rolesLoader = async () => {
    return await queryClient.ensureQueryData(rolesQuery);
};
