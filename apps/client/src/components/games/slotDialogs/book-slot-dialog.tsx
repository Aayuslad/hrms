import { useEffect, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBookSlot, type BookSlotRequest } from '@/api/games-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { SlotPlayersSelector } from '../internal/slot-players-selector';

interface BookSlotDialogProps {
    gameId?: string;
    maxPlayers?: number;
    preFillDay?: string;
    preFillTime?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const bookSlotFormSchema = z.object({
    gameId: z.string(),
    day: z.string().min(1, 'Day is required'),
    startTime: z.string().min(1, 'Start time is required'),
    playerIds: z.string().array().optional(),
}) satisfies z.ZodType<BookSlotRequest>;

const BookSlotDialog = ({
    gameId,
    maxPlayers = 1,
    preFillDay,
    preFillTime,
    isOpen: externalOpen,
    onOpenChange: externalOnOpenChange,
}: BookSlotDialogProps) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = externalOpen !== undefined;
    const open = isControlled ? externalOpen : internalOpen;
    const setOpen = isControlled ? externalOnOpenChange! : setInternalOpen;
    const bookSlotMutation = useBookSlot();

    const form = useForm<BookSlotRequest>({
        resolver: zodResolver(bookSlotFormSchema),
        defaultValues: {
            gameId: gameId ?? '',
            day: preFillDay ?? new Date().toISOString().slice(0, 10),
            startTime: preFillTime ?? '',
            playerIds: [],
        },
    });

    const playersFieldArray = useFieldArray({
        control: form.control,
        name: 'playerIds',
    });

    useEffect(() => {
        form.setValue(
            'day',
            preFillDay ?? new Date().toISOString().slice(0, 10)
        );
        form.setValue('startTime', preFillTime ?? '');
        form.setValue('gameId', gameId ?? '');
    }, [preFillDay, preFillTime, gameId, form]);

    const onSubmit = (data: BookSlotRequest) => {
        bookSlotMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages
            .slice()
            .reverse()
            .forEach((msg: string | undefined) => toast.error(msg));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button variant="outline">Book Slot</Button>
                </DialogTrigger>
            )}

            <DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle>Book Slot</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="px-6 py-4">
                        <div className="space-y-4">
                            <div className="grid gap-3">
                                <Label htmlFor="day">Day</Label>
                                <Input
                                    id="day"
                                    type="date"
                                    {...form.register('day')}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    {...form.register('startTime')}
                                />
                            </div>

                            <SlotPlayersSelector
                                fields={form.watch('playerIds') ?? []}
                                append={playersFieldArray.append}
                                remove={playersFieldArray.remove}
                            />
                        </div>
                    </ScrollArea>

                    <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={bookSlotMutation.isPending}
                        >
                            {bookSlotMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Book
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BookSlotDialog;
