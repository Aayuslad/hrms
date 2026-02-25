import { CreateExpenseCatrgoryDialog } from '@/components/configurations/expenseCategories/create-expense-category-dialog';
import { ExpenseCatrgoriesTable } from '@/components/configurations/expenseCategories/expense-categories-table';
import { Outlet } from 'react-router';

export function ExpenseCatrgoryPage() {
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
                <div className="w-[230px] mb-4">
                    <CreateExpenseCatrgoryDialog visibleTo={['Admin', 'HR']} />
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
        </div>
    );
}
