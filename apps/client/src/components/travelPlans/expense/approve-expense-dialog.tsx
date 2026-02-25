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

interface ApproveExpenseDialogProps {
    travelPlanId: string;
    participantId: string;
    expenseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ApproveExpenseDialog({
    travelPlanId,
    participantId,
    expenseId,
    open,
    onOpenChange,
}: Readonly<ApproveExpenseDialogProps>) {
    const approveExpenseMutation = useApproveExpense();
    const [remarks, setRemarks] = useState('');

    const handleApprove = () => {
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
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
