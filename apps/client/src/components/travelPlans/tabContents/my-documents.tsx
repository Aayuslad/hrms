import { useGetMe } from '@/api/user-api';
import { useGetParticipant } from '@/api/travel-api';
import { MyDocumentsTable } from '../tables/my-documents-table';

export function MyDocuments({
    travelPlanId,
}: Readonly<{ travelPlanId: string }>) {
    const { data: me } = useGetMe();
    const { data: participant } = useGetParticipant(travelPlanId, me?.id);

    return (
        <MyDocumentsTable
            documents={participant?.documents || []}
            travelPlanId={travelPlanId}
            participantId={me?.id}
        />
    );
}
