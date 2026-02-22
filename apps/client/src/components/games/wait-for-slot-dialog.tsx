import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
    useWaitForSpecificSlot,
    type WaitSpecificSlotRequest,
} from '@/api/games-api';
import { useGetUserList, type UserSummary } from '@/api/user-api';
import { useGetMe } from '@/api/user-api';
import { Spinner } from '@/components/ui/spinner';

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

    const [selected, setSelected] = useState<string[]>([]);
    const { data: users = [] } = useGetUserList();
    // Get current user
    const { data: me } = useGetMe();
    // Remove current user from selectable users
    const filteredUsers = users.filter((u: UserSummary) => u.id !== me?.id);
    const waitForSlotMutation = useWaitForSpecificSlot(gameId ?? '', slotId ?? '');

    const form = useForm<WaitSpecificSlotRequest>({
        resolver: zodResolver(waitForSlotFormSchema),
        defaultValues: {
            gameId: gameId ?? '',
            slotId: slotId ?? '',
            playerIds: [],
        },
    });

    // Update form values when props change
    React.useEffect(() => {
        form.setValue('gameId', gameId ?? '');
        form.setValue('slotId', slotId ?? '');
    }, [gameId, slotId, form]);

    const toggleUser = (id: string) => {
        setSelected((prev) => {
            if (prev.includes(id)) return prev.filter((p) => p !== id);
            return [...prev, id];
        });
    };

    const onSubmit = (data: WaitSpecificSlotRequest) => {
        const payload: WaitSpecificSlotRequest = {
            ...data,
            playerIds: selected,
        };

        waitForSlotMutation.mutate(payload, {
            onSuccess: () => {
                form.reset();
                setSelected([]);
                setOpen(false);
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message).filter(Boolean) as string[];
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
                            <div className="grid gap-3">
                                <Label>Players (optional)</Label>

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
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium">{u.userName}</span>
                                                                <span className="text-xs text-muted-foreground">{u.firstName} {u.lastName}</span>
                                                            </div>
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onCheckedChange={() => toggleUser(u.id as string)}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                    {selected.map((id) => {
                                        const u = users.find(
                                            (x: UserSummary) => (x.id ?? x.userName) === id
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
