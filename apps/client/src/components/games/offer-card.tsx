import { useOfferAction } from '@/api/games-api';
import type { QueuedSlotOffer } from '@/api/games-api';
import { Button } from '@/components/ui/button';

interface OfferCardProps {
    readonly offer: QueuedSlotOffer;
}

export function OfferCard({ offer }: OfferCardProps) {
    const offerAction = useOfferAction();

    if (!offer.expiresAt || !offer.id || !offer.queueSlotId || !offer.cancelledSlotId) {
        return null;
    }

    const expiresAt = new Date(offer.expiresAt);
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const minutes = Math.max(0, Math.floor(diff / 60000));

    const handleAccept = () => {
        offerAction.mutate({
            offerId: offer.id!,
            action: 'accept',
            payload: {
                queuedSlotId: offer.queueSlotId!,
                canceledSlotId: offer.cancelledSlotId!,
                action: 'accept'
            }
        });
    };

    const handleReject = () => {
        offerAction.mutate({
            offerId: offer.id!,
            action: 'reject',
            payload: {
                queuedSlotId: offer.queueSlotId!,
                canceledSlotId: offer.cancelledSlotId!,
                action: 'reject'
            }
        });
    };

    return (
        <div className="border p-4 rounded-lg shadow-sm">
            <p className="text-sm mb-2">
                Your request for a slot on specific day is available, accept within {minutes} minutes.
            </p>
            <div className="flex gap-2">
                <Button onClick={handleAccept} size="sm">
                    Accept
                </Button>
                <Button onClick={handleReject} variant="outline" size="sm">
                    Reject
                </Button>
            </div>
        </div>
    );
}
