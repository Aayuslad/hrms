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

import {
    useCreateTravelPlan,
    type CreateTravelPlanRequest,
} from '@/api/travel-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import DateTimeSelector from '../ui/date-time-selector';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAccessChecker } from '@/hooks/use-has-access';

const createTravelPlanFormSchema = z.object({
    title: z.string().min(1, 'Title is required').max(80),
    destination: z.string().min(1, 'Destination is required').max(80),
    description: z.string().optional(),
    startAt: z.string().optional(),
    endAt: z.string().optional(),
}) satisfies z.ZodType<CreateTravelPlanRequest>;

type Props = {
    visibleTo: string[];
};

const CreateTravelPlanDialog = ({ visibleTo }: Props) => {
    const canAccess = useAccessChecker();
    const createTravelPlanMutation = useCreateTravelPlan();
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(createTravelPlanFormSchema),
        defaultValues: {
            title: '',
            destination: '',
            description: '',
            startAt: '',
            endAt: '',
        },
    } as const);

    const onSubmit = async (data: CreateTravelPlanRequest) => {
        console.log('Submitting form with data:', data);
        await createTravelPlanMutation.mutate(data, {
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
                <Button>Create Travel Plan</Button>
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
                                    <Label htmlFor="title">Title*</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Business trip 2026"
                                        {...form.register('title')}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="title">Destination*</Label>
                                    <Input
                                        id="destination"
                                        type="text"
                                        placeholder="Bali"
                                        {...form.register('destination')}
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
                                        setDateTime={(date: Date) =>
                                            form.setValue(
                                                'endAt',
                                                date.toISOString()
                                            )
                                        }
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
                                disabled={createTravelPlanMutation.isPending}
                            >
                                {createTravelPlanMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Travel Plan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTravelPlanDialog;
