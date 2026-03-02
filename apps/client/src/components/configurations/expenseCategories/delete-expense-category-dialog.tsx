import { useDeleteExpenseCategory } from '@/api/expense-category-api';
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
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

export function DeleteExpenseCategoryDialog() {
    const deleteExpenseCategoryMutation = useDeleteExpenseCategory();
    const { configDialogOpen, configDialogTarget, closeConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                configDialogOpen: s.configDialogOpen,
                configDialogTarget: s.configDialogTarget,
                closeConfigDialog: s.closeConfigDialog,
            }))
        );

    const id = configDialogTarget?.payload as string | undefined;

    const submit = async (id?: string) => {
        if (!id) {
            return;
        }
        deleteExpenseCategoryMutation.mutate(id, {
            onSuccess: () => {
                closeConfigDialog();
            },
        });
    };

    return (
        <Dialog
            open={
                configDialogOpen &&
                configDialogTarget?.entity === 'expenseCategories' &&
                configDialogTarget?.mode === 'delete'
            }
            onOpenChange={(state) => state === false && closeConfigDialog()}
        >
            <DialogContent className="sm:max-w-lg space-y-2">
                <DialogHeader className="space-y-2">
                    <DialogTitle>Confirm Delete Expense Category</DialogTitle>
                    <DialogDescription>
                        This expense category will be removed and this action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild className="flex-1">
                        <Button
                            variant="secondary"
                            disabled={deleteExpenseCategoryMutation.isPending}
                            onClick={() => closeConfigDialog()}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        variant="default"
                        className="flex-1 bg-red-500 text-white hover:bg-red-600"
                        onClick={() => submit(id)}
                        disabled={deleteExpenseCategoryMutation.isPending}
                    >
                        {deleteExpenseCategoryMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
