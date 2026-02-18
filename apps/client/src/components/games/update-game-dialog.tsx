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
import { Loader2, Pencil } from 'lucide-react';

import {
    useUpdateGame,
    type GameSummary,
    type UpdateGameRequest,
} from '@/api/games-api';
import { WEEK_DAYS } from '@/types/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { NumberInputWithEndButtons } from '../ui/number-input-with-end-buttons';
import TimeInput from '../ui/time-input';
import { WeekDaySelector } from '../ui/week-day-selector';

const updateGameFormSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1, 'Name is required').max(80),
    slotDuration: z.coerce.number().int().positive(),
    maxSlotPlayers: z.coerce.number().int().positive(),
    openTime: z.string().min(1, 'Open time is required'),
    closeTime: z.string().min(1, 'Close time is required'),
    openingDayOfWeek: z.enum(WEEK_DAYS),
    closingDayOfWeek: z.enum(WEEK_DAYS),
}) satisfies z.ZodType<UpdateGameRequest>;

type Param = {
    game: GameSummary;
};

const UpdateGameDialog = ({ game }: Param) => {
    const updateGameMutation = useUpdateGame();
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(updateGameFormSchema),
        defaultValues: {
            id: game.id,
            name: game.name,
            slotDuration: game.slotDuration,
            maxSlotPlayers: game.maxSlotPlayers,
            openTime: game.openTime,
            closeTime: game.closeTime,
            openingDayOfWeek: game.openingDayOfWeek,
            closingDayOfWeek: game.closingDayOfWeek,
        },
    } as const);

    const onSubmit = async (data: UpdateGameRequest) => {
        console.log('Submitting form with data:', data);
        await updateGameMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.reverse().forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Update Game
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="space-y-6"
                >
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle>
                            Update game - <span>{game.name}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="px-6 py-4">
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <NumberInputWithEndButtons
                                    name="slotDuration"
                                    control={form.control}
                                    label="Slot Duration (minutes)*"
                                    minValue={1}
                                    step={1}
                                />

                                <NumberInputWithEndButtons
                                    name="maxSlotPlayers"
                                    control={form.control}
                                    label="Max Players per Slot*"
                                    minValue={1}
                                    step={1}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <TimeInput
                                    name="openTime"
                                    control={form.control}
                                    label="Open Time*"
                                />
                                <TimeInput
                                    name="closeTime"
                                    control={form.control}
                                    label="Close Time*"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <WeekDaySelector
                                    name="openingDayOfWeek"
                                    control={form.control}
                                    label="Opening Day*"
                                />
                                <WeekDaySelector
                                    name="closingDayOfWeek"
                                    control={form.control}
                                    label="Closing Day*"
                                />
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="flex-row justify-end gap-3 border-t px-6 py-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={updateGameMutation.isPending}
                        >
                            {updateGameMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update Game
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateGameDialog;
