import { useApproveExpense } from '@/api/travel-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import type { ApproveRejectTarget } from '@/store/travel-store';

interface ApproveExpenseDialogProps {
    travelPlanId?: string;
    participantId?: string;
    expenseId?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ApproveExpenseDialog({
    travelPlanId: propTravelPlanId,
    participantId: propParticipantId,
    expenseId: propExpenseId,
    open: propOpen,
    onOpenChange: propOnOpenChange,
}: Readonly<ApproveExpenseDialogProps>) {
    const approveExpenseMutation = useApproveExpense();
    const [remarks, setRemarks] = useState('');

    const { approveDialogOpen, approveDialogTarget, closeApproveDialog } =
        useAppStore(
            useShallow((s) => ({
                approveDialogOpen: s.approveDialogOpen,
                approveDialogTarget: s.approveDialogTarget,
                closeApproveDialog: s.closeApproveDialog,
            }))
        );

    const target: ApproveRejectTarget | null = approveDialogTarget;

    const open = typeof propOpen === 'boolean' ? propOpen : approveDialogOpen;
    const travelPlanId = propTravelPlanId ?? target?.travelPlanId!;
    const participantId = propParticipantId ?? target?.participantId!;
    const expenseId = propExpenseId ?? target?.expenseId!;
    const onOpenChange =
        propOnOpenChange ?? ((state: boolean) => state === false && closeApproveDialog());

    const handleApprove = () => {
        if (!participantId || !expenseId || !travelPlanId) return;
        approveExpenseMutation.mutate(
            {
                participantId,
                payload: {
                    expenseId,
                    travelPlanId,
                    remarks: remarks.trim() || undefined,
                },
            },
            {
                onSuccess: () => {
                    setRemarks('');
                    if (propOnOpenChange) propOnOpenChange(false);
                    else closeApproveDialog();
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={(state) => onOpenChange(state)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Approve Expense</DialogTitle>
                    <DialogDescription>
                        Add optional remarks before approving this expense.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Textarea
                        placeholder="Add remarks (optional)"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={approveExpenseMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApprove}
                        disabled={approveExpenseMutation.isPending}
                    >
                        {approveExpenseMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
