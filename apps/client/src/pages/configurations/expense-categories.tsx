import { CreateExpenseCatrgoryDialog } from '@/components/configurations/expenseCategories/create-expense-category-dialog';
import { ExpenseCatrgoriesTable } from '@/components/configurations/expenseCategories/expense-categories-table';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { UpdateExpenseCategoryDialog } from '@/components/configurations/expenseCategories/update-expense-category-dialog';
import { DeleteExpenseCategoryDialog } from '@/components/configurations/expenseCategories/delete-expense-category-dialog';

export function ExpenseCatrgoryPage() {
    const { openConfigDialog } = useAppStore(
        useShallow((s) => ({
            openConfigDialog: s.openConfigDialog,
        }))
    );

    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Expense Categories</h1>
                    <p>
                        Standardize travel expense categories and
                        classifications.
                    </p>
                </div>
                <div className="w-[260px] mb-4">
                    <Button
                        variant="secondary"
                        className="border"
                        onClick={() =>
                            openConfigDialog({
                                entity: 'expenseCategories',
                                mode: 'create',
                            })
                        }
                    >
                        + Create Expense category
                    </Button>
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-10">
                <div className="w-full flex flex-col items-center">
                    <div className="mr-12 w-fit">
                        <ExpenseCatrgoriesTable />
                        <Outlet />
                    </div>
                </div>
            </div>

            <CreateExpenseCatrgoryDialog visibleTo={['Admin', 'HR']} />

            <UpdateExpenseCategoryDialog />
            <DeleteExpenseCategoryDialog />
        </div>
    );
}
