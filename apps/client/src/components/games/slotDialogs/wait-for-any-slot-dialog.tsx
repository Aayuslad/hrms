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
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useWaitForAnySlot, type WaitAnySlotRequest } from '@/api/games-api';
import { Loader2 } from 'lucide-react';
import { SlotPlayersSelector } from '../internal/slot-players-selector';

interface WaitForAnySlotDialogProps {
    gameId?: string;
    day?: string;
}

const waitForAnySlotFormSchema = z.object({
    gameId: z.string(),
    day: z.string(),
    playerIds: z.array(z.string()).optional(),
}) satisfies z.ZodType<WaitAnySlotRequest>;

const WaitForAnySlotDialog = ({ gameId, day }: WaitForAnySlotDialogProps) => {
    const [open, setOpen] = useState(false);
    const waitForAnySlotMutation = useWaitForAnySlot();

    const form = useForm<WaitAnySlotRequest>({
        resolver: zodResolver(waitForAnySlotFormSchema),
        defaultValues: {
            gameId: gameId ?? '',
            day: day ?? '',
            playerIds: [],
        },
    });

    const playersFieldArray = useFieldArray({
        control: form.control,
        //@ts-ignore
        name: 'playerIds',
    });

    React.useEffect(() => {
        form.setValue('gameId', gameId ?? '');
        form.setValue('day', day ?? '');
    }, [gameId, day, form]);

    const onSubmit = (data: WaitAnySlotRequest) => {
        waitForAnySlotMutation.mutate(data, {
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
            <DialogTrigger asChild>
                <Button variant="ghost" className="underline" size="sm">
                    Wait for any slot
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle>Wait for Slot on {day}</DialogTitle>
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
                            disabled={waitForAnySlotMutation.isPending}
                        >
                            {waitForAnySlotMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Wait for any slot
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WaitForAnySlotDialog;
