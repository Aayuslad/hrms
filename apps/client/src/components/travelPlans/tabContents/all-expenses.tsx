import { useGetTravelPlanExpenses } from '@/api/travel-api';
import { AllExpensesTable } from '../tables/all-expenses-table';

export function AllExpenses({
    travelPlanId,
}: Readonly<{ travelPlanId: string }>) {
    const { data } = useGetTravelPlanExpenses(travelPlanId);

    return (
        <div>
            <AllExpensesTable
                expenses={data?.expenses || []}
                total={data?.total}
            />
        </div>
    );
}
