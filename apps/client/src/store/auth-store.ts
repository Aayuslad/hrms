import type { StateCreator } from 'zustand';

export type AuthStoreSliceType = {
    userRoles: string[];

    setUserRoles: (roles: string[]) => void;
};

export const createAuthSlice: StateCreator<AuthStoreSliceType> = (set) => ({
    userRoles: [],

    setUserRoles: (roles: string[]) => {
        set(() => ({ userRoles: roles }));
    },
});
