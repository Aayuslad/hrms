import { useGetMe } from '@/api/user-api';
import { useGetParticipant } from '@/api/travel-api';
import { MyExpensesTable } from '../tables/my-expenses-table';

export function MyExpenses({ travelPlanId }: Readonly<{ travelPlanId: string }>) {
    const { data: me } = useGetMe();
    const { data: participant } = useGetParticipant(travelPlanId, me?.id);

    return (
        <MyExpensesTable
            expenses={participant?.expenses || []}
            travelPlanId={travelPlanId}
            participantId={me?.id}
        />
    );
}
