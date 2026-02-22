import { create } from 'zustand';
import { createAuthSlice, type AuthStoreSliceType } from './auth-store';
import {
    createUiSlice,
    SIDEBAR_STATE_KEY,
    THEME_KEY,
    type UiStoreSliceType,
} from './ui-store';

type AppStoreType = UiStoreSliceType & AuthStoreSliceType;

export const useAppStore = create<AppStoreType>((...args) => ({
    ...createUiSlice(...args),
    ...createAuthSlice(...args),
}));

// updating configs from localstorage
if (typeof window !== 'undefined') {
    const theme = localStorage.getItem(THEME_KEY);
    useAppStore.getState().setTheme(theme as 'light' | 'dark');

    const sidebarState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (sidebarState) {
        useAppStore
            .getState()
            .setSidebarState(sidebarState as 'opened' | 'closed');
    }
}
