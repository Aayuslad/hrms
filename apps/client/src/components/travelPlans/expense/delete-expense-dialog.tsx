import { useDeleteExpense } from '@/api/travel-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface DeleteExpenseDialogProps {
    expenseId: string;
    travelPlanId: string;
    participantId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteExpenseDialog({
    expenseId,
    travelPlanId,
    participantId,
    open,
    onOpenChange,
}: Readonly<DeleteExpenseDialogProps>) {
    const deleteExpenseMutation = useDeleteExpense();

    const submit = async (id: string) => {
        if (!id) {
            return;
        }
        deleteExpenseMutation.mutate(
            {
                expenseId: expenseId,
                travelPlanId: travelPlanId,
                participantId: participantId,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg space-y-2">
                <DialogHeader className="space-y-2">
                    <DialogTitle>Confirm Delete Expense</DialogTitle>
                    <DialogDescription>
                        This expense will be removed and this action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild className="flex-1">
                        <Button
                            variant="secondary"
                            disabled={deleteExpenseMutation.isPending}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        variant="default"
                        className="flex-1 bg-red-500 text-white hover:bg-red-600"
                        onClick={() => submit(id)}
                        disabled={deleteExpenseMutation.isPending}
                    >
                        {deleteExpenseMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
