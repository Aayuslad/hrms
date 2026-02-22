import type { StateCreator } from 'zustand';

export const THEME_KEY = 'theme-preference';
export const SIDEBAR_STATE_KEY = 'sidebar-state';

export interface UiStoreSliceType {
    sidebarState: 'opened' | 'closed';
    theme: 'light' | 'dark';

    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setSidebarState: (state: 'opened' | 'closed') => void;
    toggleSidebarState: () => void;
}

export const createUiSlice: StateCreator<UiStoreSliceType> = (set, get) => ({
    theme: 'dark',
    sidebarState: 'opened',

    toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        if (newTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');

        set({ theme: newTheme });

        localStorage.setItem(THEME_KEY, newTheme);
    },

    setTheme: (newTheme) => {
        if (newTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');

        set({ theme: newTheme });

        localStorage.setItem(THEME_KEY, newTheme);
    },

    setSidebarState: (state) => {
        set({ sidebarState: state });
        localStorage.setItem(SIDEBAR_STATE_KEY, state);
    },

    toggleSidebarState: () => {
        const state = get().sidebarState;
        const newState = state === 'opened' ? 'closed' : 'opened';
        set({ sidebarState: newState });
        localStorage.setItem(SIDEBAR_STATE_KEY, newState);
    },
});
