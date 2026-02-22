import { useGetTravelPlan } from '@/api/travel-api';
import { ParticipantsTable } from '../tables/participants-table';

export function Participants({ travelPlanId }: Readonly<{ travelPlanId: string }>) {
    const { data: travelPlan } = useGetTravelPlan(travelPlanId);

    return <ParticipantsTable participants={travelPlan?.participants || []} travelPlanId={travelPlanId} />;
}
