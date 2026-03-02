import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
    useWaitForSpecificSlot,
    type WaitSpecificSlotRequest,
} from '@/api/games-api';
import { Spinner } from '@/components/ui/spinner';
import { SlotPlayersSelector } from '../internal/slot-players-selector';

interface WaitForSlotDialogProps {
    gameId?: string;
    slotId?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const waitForSlotFormSchema = z.object({
    gameId: z.string(),
    slotId: z.string(),
    playerIds: z.array(z.string()).optional(),
}) satisfies z.ZodType<WaitSpecificSlotRequest>;

const WaitForSlotDialog = ({
    gameId,
    slotId,
    isOpen: externalOpen,
    onOpenChange: externalOnOpenChange,
}: WaitForSlotDialogProps) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = externalOpen !== undefined;
    const open = isControlled ? externalOpen : internalOpen;
    const setOpen = isControlled ? externalOnOpenChange! : setInternalOpen;
    const waitForSlotMutation = useWaitForSpecificSlot();

    const form = useForm<WaitSpecificSlotRequest>({
        resolver: zodResolver(waitForSlotFormSchema),
        defaultValues: {
            gameId: gameId ?? '',
            slotId: slotId ?? '',
            playerIds: [],
        },
    });

    const playersFieldArray = useFieldArray({
        control: form.control,
        name: 'playerIds',
    });

    // Update form values when props change
    React.useEffect(() => {
        form.setValue('gameId', gameId ?? '');
        form.setValue('slotId', slotId ?? '');
    }, [gameId, slotId, form]);

    const onSubmit = (data: WaitSpecificSlotRequest) => {
        waitForSlotMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors)
            .map((err) => err.message)
            .filter(Boolean) as string[];
        [...messages].reverse().forEach((msg: string) => toast.error(msg));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle>Wait for Slot</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="px-6 py-4">
                        <div className="space-y-4">
                            <SlotPlayersSelector
                                fields={form.watch('playerIds') ?? []}
                                append={playersFieldArray.append}
                                remove={playersFieldArray.remove}
                            />{' '}
                        </div>
                    </ScrollArea>

                    <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={waitForSlotMutation.isPending}
                        >
                            {waitForSlotMutation.isPending ? (
                                <span className="flex items-center">
                                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Waiting...
                                </span>
                            ) : (
                                'Wait for Slot'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WaitForSlotDialog;
