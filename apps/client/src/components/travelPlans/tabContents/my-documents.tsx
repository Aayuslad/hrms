import { useGetParticipant } from '@/api/travel-api';
import { useGetMe } from '@/api/user-api';
import { Spinner } from '@/components/ui/spinner';
import { MyDocumentsTable } from '../tables/my-documents-table';

export function MyDocuments({
    travelPlanId,
}: Readonly<{ travelPlanId: string }>) {
    const { data: me } = useGetMe();
    const {
        data: participant,
        isLoading,
        isError,
    } = useGetParticipant(travelPlanId, me?.id);

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
        <MyDocumentsTable
            documents={participant?.documents || []}
            travelPlanId={travelPlanId}
            participantId={me?.id}
        />
    );
}
