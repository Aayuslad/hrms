import { useRejectExpense } from '@/api/travel-api';
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

interface RejectExpenseDialogProps {
    travelPlanId?: string;
    participantId?: string;
    expenseId?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function RejectExpenseDialog({
    travelPlanId: propTravelPlanId,
    participantId: propParticipantId,
    expenseId: propExpenseId,
    open: propOpen,
    onOpenChange: propOnOpenChange,
}: Readonly<RejectExpenseDialogProps>) {
    const rejectExpenseMutation = useRejectExpense();
    const [remarks, setRemarks] = useState('');

    const { rejectDialogOpen, rejectDialogTarget, closeRejectDialog } =
        useAppStore(
            useShallow((s) => ({
                rejectDialogOpen: s.rejectDialogOpen,
                rejectDialogTarget: s.rejectDialogTarget,
                closeRejectDialog: s.closeRejectDialog,
            }))
        );

    const target: ApproveRejectTarget | null = rejectDialogTarget;

    const open = typeof propOpen === 'boolean' ? propOpen : rejectDialogOpen;
    const travelPlanId = propTravelPlanId ?? target?.travelPlanId!;
    const participantId = propParticipantId ?? target?.participantId!;
    const expenseId = propExpenseId ?? target?.expenseId!;
    const onOpenChange =
        propOnOpenChange ?? ((state: boolean) => state === false && closeRejectDialog());

    const handleReject = () => {
        if (!participantId || !expenseId || !travelPlanId) return;
        rejectExpenseMutation.mutate(
            {
                participantId,
                payload: {
                    travelPlanId,
                    expenseId,
                    remarks: remarks.trim() || undefined,
                },
            },
            {
                onSuccess: () => {
                    setRemarks('');
                    if (propOnOpenChange) propOnOpenChange(false);
                    else closeRejectDialog();
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={(state) => onOpenChange(state)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Reject Expense</DialogTitle>
                    <DialogDescription>
                        Add remarks explaining the rejection.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Textarea
                        placeholder="Add remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        required
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={rejectExpenseMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={
                            rejectExpenseMutation.isPending || !remarks.trim()
                        }
                    >
                        {rejectExpenseMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Reject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
