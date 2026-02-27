import { useRemoveParticipants } from '@/api/travel-api';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

type Props = {
    selectedParticipantIds: string[];
    travelPlanId: string;
    clearSelectedParticipantIds: () => void;
};

export function RemoveParticipantsDialog({
    selectedParticipantIds,
    travelPlanId,
    clearSelectedParticipantIds,
}: Props) {
    const removeParticipantsMutation = useRemoveParticipants();
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

    return (
        <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    Remove {selectedParticipantIds.length} participants
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm removal</DialogTitle>
                </DialogHeader>
                <p className="py-4">
                    Are you sure you want to remove{' '}
                    {selectedParticipantIds.length} participants ?
                </p>
                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        disabled={
                            selectedParticipantIds.length === 0 ||
                            removeParticipantsMutation.isPending
                        }
                        onClick={() => {
                            removeParticipantsMutation.mutate(
                                {
                                    travelPlanId,
                                    payload: {
                                        participantIds: selectedParticipantIds,
                                    },
                                },
                                {
                                    onSuccess: () => {
                                        clearSelectedParticipantIds();
                                        setRemoveDialogOpen(false);
                                    },
                                }
                            );
                        }}
                    >
                        {removeParticipantsMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Remove
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
