import {
    useUpdateExpenseCategory,
    type ExpenseCategory,
    type UpdateExpenseCategoryRequest,
} from '@/api/expense-category-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';

const updateExpenseCategoryFormSchema = z.object({
    id: z.string().nonempty('Expense Category ID is required'),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<UpdateExpenseCategoryRequest>;

export function UpdateExpenseCategoryDialog() {
    const location = useLocation();
    const expenseCategory = location.state as ExpenseCategory;
    const updateExpenseCategoryMutation = useUpdateExpenseCategory();
    const navigate = useNavigate();

    const form = useForm<UpdateExpenseCategoryRequest>({
        resolver: zodResolver(updateExpenseCategoryFormSchema),
        defaultValues: {
            id: expenseCategory.id,
            name: expenseCategory.name,
        },
    });

    const onSubmit = async (data: UpdateExpenseCategoryRequest) => {
        updateExpenseCategoryMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                navigate('/configuration/expense-categories');
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.slice().reverse().forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-lg">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="grid gap-7"
                >
                    <DialogHeader>
                        <DialogTitle>Update Expense Category</DialogTitle>
                        <DialogDescription>
                            Update the expense category details and click Save.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...form.register('name')} />
                        </div>
                    </div>

                    <DialogFooter>
                        <div>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={updateExpenseCategoryMutation.isPending}
                                onClick={() =>
                                    navigate('/configuration/expense-categories')
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={updateExpenseCategoryMutation.isPending}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}