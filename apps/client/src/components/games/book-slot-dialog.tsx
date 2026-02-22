import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useBookSlot, type BookSlotRequest } from '@/api/games-api';
import { useGetMe, useGetUserList, type UserSummary } from '@/api/user-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Spinner } from '../ui/spinner';

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
    playerIds: z.array(z.string()).optional(),
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
    const { data: me } = useGetMe();

    const [selected, setSelected] = useState<string[]>([]);
    const { data: users = [] } = useGetUserList();
    // Remove current user from selectable users
    const filteredUsers = users.filter((u: UserSummary) => u.id !== me?.id);
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

    // Update form values when pre-fill values change
    useEffect(() => {
        form.setValue(
            'day',
            preFillDay ?? new Date().toISOString().slice(0, 10)
        );
        form.setValue('startTime', preFillTime ?? '');
        form.setValue('gameId', gameId ?? '');
    }, [preFillDay, preFillTime, gameId, form]);

    const toggleUser = (id: string) => {
        setSelected((prev) => {
            if (prev.includes(id)) return prev.filter((p) => p !== id);
            if (prev.length >= (maxPlayers ?? 1)) {
                toast.error(`You can select up to ${maxPlayers} players`);
                return prev;
            }
            return [...prev, id];
        });
    };

    const onSubmit = (data: BookSlotRequest) => {
        const payload: BookSlotRequest = {
            ...data,
            playerIds: selected,
        };

        bookSlotMutation.mutate(payload, {
            onSuccess: () => {
                form.reset();
                setSelected([]);
                setOpen(false);
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.slice().reverse().forEach((msg: string | undefined) => toast.error(msg));
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

                            <div className="grid gap-3">
                                <Label>Players (max {maxPlayers})</Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">
                                            Select Players
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent>
                                        <div className="max-h-60 w-64 overflow-auto">
                                            <div className="space-y-2">
                                                {filteredUsers.map((u: UserSummary) => {
                                                    const isChecked = selected.includes(u.id as string);
                                                    return (
                                                        <div
                                                            key={u.id}
                                                            className="flex items-center justify-between gap-3"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    onCheckedChange={() => toggleUser(u.id as string)}
                                                                    disabled={!isChecked && selected.length >= maxPlayers}
                                                                    className="me-2"
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium">{u.userName}</span>
                                                                    <span className="text-xs text-muted-foreground">{u.firstName} {u.lastName}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <div className="flex flex-wrap gap-2">
                                    {selected.map((id) => {
                                        const u = users.find(
                                            (x) => (x.id ?? x.userName) === id
                                        );
                                        return (
                                            <div
                                                key={id}
                                                className="rounded-md border px-2 py-1 text-sm"
                                            >
                                                {u?.userName} — {u?.firstName}{' '}
                                                {u?.lastName}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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
                            {bookSlotMutation.isPending ? (
                                <span className="flex items-center">
                                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Booking...
                                </span>
                            ) : (
                                'Book'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BookSlotDialog;
