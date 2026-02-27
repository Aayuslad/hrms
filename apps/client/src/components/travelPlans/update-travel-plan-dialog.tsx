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
import { Loader2, Pencil } from 'lucide-react';

import {
    useUpdateTravelPlan,
    type TravelPlan,
    type UpdateTravelPlanRequest,
} from '@/api/travel-api';
import { useGetUserList } from '@/api/user-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import DateTimeSelector from '../ui/date-time-selector';
import { Label } from '../ui/label';
import { NumberInputWithEndButtons } from '../ui/number-input-with-end-buttons';
import { Textarea } from '../ui/textarea';
import { ParticipantSelector } from './participant-selector';

const updateTravelPlanFormSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1, 'Title is required').max(80),
    destination: z.string().min(1, 'Destination is required').max(80),
    description: z.string().optional(),
    startAt: z.string().optional(),
    endAt: z.string().optional(),
    maxExpenseAmountPerDay: z.number().optional(),
    participants: z.array(z.string()).optional(),
}) satisfies z.ZodType<UpdateTravelPlanRequest>;

type Props = {
    travelPlan: TravelPlan;
};

const UpdateTravelPlanDialog = ({ travelPlan }: Props) => {
    const updateTravelPlanMutation = useUpdateTravelPlan();
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(updateTravelPlanFormSchema),
        defaultValues: {
            id: travelPlan.id,
            title: travelPlan.title,
            destination: travelPlan.destination,
            description: travelPlan.description,
            startAt: travelPlan.startAt,
            endAt: travelPlan.endAt,
            maxExpenseAmountPerDay: travelPlan.maxExpenseAmountPerDay ?? 0,
            participants: travelPlan.participants?.map((x) => x.id) ?? [],
        },
    } as const);

    const participantsFieldArray = useFieldArray({
        control: form.control,
        name: 'participants',
    });

    console.log('Form default values:', form.getValues('participants'));

    const onSubmit = async (data: UpdateTravelPlanRequest) => {
        await updateTravelPlanMutation.mutate(data, {
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
                <Button
                    variant="ghost"
                    className="flex items-center w-full gap-2"
                >
                    <Pencil className="h-4 w-4" />
                    Update Travel Plan
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle>
                                Update Travel Plan - {travelPlan.title}
                            </DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4 h-[400px]">
                            <div className="space-y-5">
                                <div className="grid gap-3">
                                    <Label htmlFor="title">Title*</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Business trip 2026"
                                        {...form.register('title')}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="title">Description*</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="bla bla bla bla....."
                                        {...form.register('description')}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <DateTimeSelector
                                        name="startDate"
                                        label="Start Date"
                                        defaultDate={
                                            new Date(
                                                form.getValues(
                                                    'startAt'
                                                ) as string
                                            )
                                        }
                                        setDateTime={(date: Date) =>
                                            form.setValue(
                                                'startAt',
                                                date.toISOString()
                                            )
                                        }
                                    />
                                    <DateTimeSelector
                                        name="endDate"
                                        label="End Date"
                                        defaultDate={
                                            new Date(
                                                form.getValues(
                                                    'endAt'
                                                ) as string
                                            )
                                        }
                                        setDateTime={(date: Date) =>
                                            form.setValue(
                                                'endAt',
                                                date.toISOString()
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <NumberInputWithEndButtons
                                        name={'maxExpenseAmountPerDay'}
                                        control={form.control}
                                        label="Max expense amount / Day (INR)"
                                        // maxValue={}
                                        step={100}
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
                                disabled={updateTravelPlanMutation.isPending}
                            >
                                {updateTravelPlanMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Travel Plan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateTravelPlanDialog;
