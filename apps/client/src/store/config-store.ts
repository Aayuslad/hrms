import type { StateCreator } from 'zustand';

export type ConfigDialogTarget = {
    entity: string;
    mode: string;
    payload?: any;
};

export interface ConfigStoreSliceType {
    configDialogOpen: boolean;
    configDialogTarget: ConfigDialogTarget | null;

    openConfigDialog: (target: ConfigDialogTarget) => void;
    closeConfigDialog: () => void;
    setConfigDialogOpen: (state: boolean) => void;
    setConfigDialogTarget: (target: ConfigDialogTarget | null) => void;
}

export const createConfigSlice: StateCreator<ConfigStoreSliceType> = (set) => ({
    configDialogOpen: false,
    configDialogTarget: null,

    openConfigDialog: (target) => set({ configDialogTarget: target, configDialogOpen: true }),
    closeConfigDialog: () => set({ configDialogTarget: null, configDialogOpen: false }),
    setConfigDialogOpen: (state) => set({ configDialogOpen: state }),
    setConfigDialogTarget: (target) => set({ configDialogTarget: target }),
});
