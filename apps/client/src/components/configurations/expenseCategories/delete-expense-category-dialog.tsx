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
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function DeleteExpenseCategoryDialog() {
    const location = useLocation();
    const id = location.state as string;
    const deleteExpenseCategoryMutation = useDeleteExpenseCategory();
    const navigate = useNavigate();

    const submit = async (id: string | null) => {
        if (!id) {
            return;
        }
        deleteExpenseCategoryMutation.mutate(id, {
            onSuccess: () => {
                navigate('/configuration/expense-categories');
            },
        });
    };

    return (
        <Dialog open={true}>
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
                            onClick={() =>
                                navigate('/configuration/expense-categories')
                            }
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