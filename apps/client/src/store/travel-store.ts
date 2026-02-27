import type { StateCreator } from 'zustand';

export type Proof = {
    id?: string | undefined;
    docUrl?: string | undefined;
};

export type ApproveRejectTarget = {
    travelPlanId: string;
    participantId: string;
    expenseId: string;
};

export interface TravelStoreSliceType {
    // proofs dialog
    proofsDialogOpen: boolean;
    proofsToShow: Proof[] | null;

    openProofsDialog: (proofs: Proof[] | null) => void;
    closeProofsDialog: () => void;
    setProofsDialogOpen: (state: boolean) => void;
    setProofsToShow: (proofs: Proof[] | null) => void;

    // approve dialog (hybrid)
    approveDialogOpen: boolean;
    approveDialogTarget: ApproveRejectTarget | null;
    openApproveDialog: (target: ApproveRejectTarget) => void;
    closeApproveDialog: () => void;
    setApproveDialogOpen: (state: boolean) => void;
    setApproveDialogTarget: (target: ApproveRejectTarget | null) => void;

    // reject dialog (hybrid)
    rejectDialogOpen: boolean;
    rejectDialogTarget: ApproveRejectTarget | null;
    openRejectDialog: (target: ApproveRejectTarget) => void;
    closeRejectDialog: () => void;
    setRejectDialogOpen: (state: boolean) => void;
    setRejectDialogTarget: (target: ApproveRejectTarget | null) => void;
}

export const createTravelSlice: StateCreator<TravelStoreSliceType> = (
    set
) => ({
    proofsDialogOpen: false,
    proofsToShow: null,

    openProofsDialog: (proofs) =>
        set({ proofsToShow: proofs, proofsDialogOpen: true }),
    closeProofsDialog: () =>
        set({ proofsToShow: null, proofsDialogOpen: false }),
    setProofsDialogOpen: (state) => set({ proofsDialogOpen: state }),
    setProofsToShow: (proofs) => set({ proofsToShow: proofs }),

    // approve dialog
    approveDialogOpen: false,
    approveDialogTarget: null,
    openApproveDialog: (target) =>
        set({ approveDialogTarget: target, approveDialogOpen: true }),
    closeApproveDialog: () =>
        set({ approveDialogTarget: null, approveDialogOpen: false }),
    setApproveDialogOpen: (state) => set({ approveDialogOpen: state }),
    setApproveDialogTarget: (target) => set({ approveDialogTarget: target }),

    // reject dialog
    rejectDialogOpen: false,
    rejectDialogTarget: null,
    openRejectDialog: (target) =>
        set({ rejectDialogTarget: target, rejectDialogOpen: true }),
    closeRejectDialog: () =>
        set({ rejectDialogTarget: null, rejectDialogOpen: false }),
    setRejectDialogOpen: (state) => set({ rejectDialogOpen: state }),
    setRejectDialogTarget: (target) => set({ rejectDialogTarget: target }),
});