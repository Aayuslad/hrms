import { useAddParticipants } from '@/api/travel-api';
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
import { Loader2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { ParticipantSelector } from './participant-selector';

const addParticipantFormSchema = z.object({
    participants: z.array(z.string()).optional(),
});

type AddParticipantFormData = z.infer<typeof addParticipantFormSchema>;

interface AddParticipantDialogProps {
    travelPlanId: string;
    existingIds: string[];
}

export default function AddParticipantDialog({
    travelPlanId,
    existingIds,
}: AddParticipantDialogProps) {
    const addMutation = useAddParticipants();
    const [open, setOpen] = React.useState(false);

    const form = useForm<AddParticipantFormData>({
        resolver: zodResolver(addParticipantFormSchema),
        defaultValues: {
            participants: [],
        },
    });

    const participantsFieldArray = useFieldArray({
        control: form.control,
        name: 'participants',
    });

    const onSubmit = async (data: AddParticipantFormData) => {
        const participants = data.participants || [];
        if (participants.length === 0) {
            toast.error('Select at least one participant');
            return;
        }

        addMutation.mutate(
            { travelPlanId, payload: { participantIds: participants } },
            {
                onSuccess: () => {
                    form.reset();
                    setOpen(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    {form.watch('participants')?.length ?? 0 > 0
                        ? `Add (${form.watch('participants')?.length})`
                        : '+ Add participants'}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[70vh]">
                <DialogHeader>
                    <DialogTitle>Add Participants</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="py-4">
                            <ParticipantSelector
                                fields={form.watch('participants') ?? []}
                                append={participantsFieldArray.append}
                                remove={participantsFieldArray.remove}
                                existingIds={existingIds}
                            />
                        </div>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={addMutation.isPending}
                            >
                                {addMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Add {form.watch('participants')?.length ?? 0}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

