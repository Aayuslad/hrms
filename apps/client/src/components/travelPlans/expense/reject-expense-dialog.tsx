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

interface RejectExpenseDialogProps {
    travelPlanId: string;
    participantId: string;
    expenseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RejectExpenseDialog({
    travelPlanId,
    participantId,
    expenseId,
    open,
    onOpenChange,
}: Readonly<RejectExpenseDialogProps>) {
    const rejectExpenseMutation = useRejectExpense();
    const [remarks, setRemarks] = useState('');

    const handleReject = () => {
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
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
