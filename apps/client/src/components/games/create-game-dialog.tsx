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
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

import { useCreateGame, type CreateGameRequest } from '@/api/games-api';
import { WEEK_DAYS } from '@/types/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Label } from '../ui/label';
import { NumberInputWithEndButtons } from '../ui/number-input-with-end-buttons';
import TimeInput from '../ui/time-input';
import { WeekDaySelector } from '../ui/week-day-selector';
import { useAccessChecker } from '@/hooks/use-has-access';

const createGameFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(80),
    slotDuration: z.coerce.number().int().positive(),
    maxSlotPlayers: z.coerce.number().int().positive(),
    openTime: z.string().min(1, 'Open time is required'),
    closeTime: z.string().min(1, 'Close time is required'),
    openingDayOfWeek: z.enum(WEEK_DAYS),
    closingDayOfWeek: z.enum(WEEK_DAYS),
}) satisfies z.ZodType<CreateGameRequest>;

type Props = {
    visibleTo: string[];
};

const CreateGameDialog = ({ visibleTo = [] }: Props) => {
    const createGameMutation = useCreateGame();
    const [open, setOpen] = useState(false);
    const canAccess = useAccessChecker();

    const form = useForm({
        resolver: zodResolver(createGameFormSchema),
        defaultValues: {
            name: '',
            slotDuration: 30,
            maxSlotPlayers: 2,
            openTime: '',
            closeTime: '',
            openingDayOfWeek: WEEK_DAYS.MONDAY,
            closingDayOfWeek: WEEK_DAYS.FRIDAY,
        },
    } as const);

    const onSubmit = async (data: CreateGameRequest) => {
        console.log('Submitting form with data:', data);
        await createGameMutation.mutate(data, {
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

    if (!canAccess(visibleTo)) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Game</Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle>Create Game</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4">
                            <div className="space-y-5">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Game Name*</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter game name"
                                        {...form.register('name')}
                                    />
                                </div>

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
                                disabled={createGameMutation.isPending}
                            >
                                {createGameMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Game
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGameDialog;
