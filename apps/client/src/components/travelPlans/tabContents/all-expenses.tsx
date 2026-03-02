import { useGetTravelPlanExpenses } from '@/api/travel-api';
import { AllExpensesTable } from '../tables/all-expenses-table';
import { Spinner } from '@/components/ui/spinner';

export function AllExpenses({
    travelPlanId,
}: Readonly<{ travelPlanId: string }>) {
    const { data, isLoading, isError } = useGetTravelPlanExpenses(travelPlanId);

    if (isLoading) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                Error fetching data...!
            </div>
        );
    }

    return (
        <div>
            <AllExpensesTable
                expenses={data?.expenses || []}
                total={data?.total}
            />
        </div>
    );
}
