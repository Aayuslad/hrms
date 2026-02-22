import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
    useCancelSlot,
} from '@/api/games-api';
import { useGetMe } from '@/api/user-api';
import type { components } from '@/types/generated/api';
import { Users } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import WaitForSlotDialog from './wait-for-slot-dialog';

type GameSlotResponse = components['schemas']['GameSlotResponse'];

interface BookedSlotDialogProps {
    gameId?: string;
    slot?: GameSlotResponse;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const BookedSlotDialog = ({
    gameId,
    slot,
    isOpen = false,
    onOpenChange,
}: BookedSlotDialogProps) => {
    const [open, setOpen] = useState(false);
    const [waitDialogOpen, setWaitDialogOpen] = useState(false);
    const openState = onOpenChange === undefined ? open : isOpen;
    const setOpenState = onOpenChange ?? setOpen;

    const { data: currentUser } = useGetMe();
    const cancelSlotMutation = useCancelSlot();

    if (!slot || !gameId) {
        return null;
    }

    // Check if current user is the organiser
    const isOrganiser = currentUser?.id === slot.organiser?.id;

    // Show wait button if user is not the organiser
    const shouldShowWaitButton = !isOrganiser;

    const handleCancel = () => {
        if (!slot.id) return;
        cancelSlotMutation.mutate(
            {
                gameId,
                slotId: slot.id,
            },
            {
                onSuccess: () => {
                    setOpenState(false);
                },
            }
        );
    };

    const handleWaitForSlot = () => {
        setWaitDialogOpen(true);
    };

    return (
        <>
            <Dialog open={openState} onOpenChange={setOpenState}>
                <DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle>Slot Details</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="px-6 py-4">
                        <div className="space-y-4">
                            {/* Organiser Info */}
                            <div>
                                <p className="text-sm font-semibold mb-2">
                                    Organiser
                                </p>
                                <div className="rounded-md border px-3 py-2 bg-muted/50">
                                    <p className="text-sm font-medium">
                                        {slot.organiser?.userName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {slot.organiser?.firstName}{' '}
                                        {slot.organiser?.lastName}
                                    </p>
                                </div>
                            </div>

                            {/* Players List */}
                            <div>
                                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Players ({slot.players?.length || 0})
                                </p>
                                <div className="space-y-2">
                                    {slot.players && slot.players.length > 0 ? (
                                        slot.players.map((player) => (
                                            <div
                                                key={player?.id}
                                                className="rounded-md border px-3 py-2 bg-muted/50 flex items-center justify-between"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {player?.userName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {player?.firstName}{' '}
                                                        {player?.lastName}
                                                    </p>
                                                </div>
                                                {currentUser?.id === player?.id && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            No other players
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4 gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>

                        {isOrganiser && (
                            <Button
                                variant="destructive"
                                disabled={cancelSlotMutation.isPending}
                                onClick={handleCancel}
                            >
                                {cancelSlotMutation.isPending ? (
                                    <span className="flex items-center">
                                        <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                        Cancelling...
                                    </span>
                                ) : (
                                    'Cancel Slot'
                                )}
                            </Button>
                        )}

                        {shouldShowWaitButton && (
                            <Button onClick={handleWaitForSlot}>
                                Wait for Slot
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <WaitForSlotDialog
                gameId={gameId}
                slotId={slot?.id}
                isOpen={waitDialogOpen}
                onOpenChange={setWaitDialogOpen}
            />
        </>
    );
};

export default BookedSlotDialog;

