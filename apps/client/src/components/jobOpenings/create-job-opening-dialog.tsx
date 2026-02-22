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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

import {
    useCreateJobOpening,
    type CreateJobOpeningRequest,
} from '@/api/jobs-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { DesignationSelector } from './designations-selector';
import { DefaultHrSelector } from './default-hr-selector';
import { HrsSelector } from './hrs-selector';
import { ReviewersSelector } from './reviewers-selector';
import { NumberInputWithEndButtons } from '../ui/number-input-with-end-buttons';
import { Input } from '../ui/input';
import { useAccessChecker } from '@/hooks/use-has-access';

const createJobOpeningFormSchema = z.object({
    description: z.string().optional(),
    designationId: z.string().min(1),
    requiredExperience: z.number().optional(),
    jd: z.string().optional(),
    defaultHrId: z.string(),
    hrs: z.array(z.string()).optional(),
    reviewers: z.array(z.string()).optional(),
}) satisfies z.ZodType<CreateJobOpeningRequest>;

type Props = {
    visibleTo: string[];
};

const CreateJobOpeningDialog = ({ visibleTo }: Props) => {
    const createJobOpeningMutation = useCreateJobOpening();
    const canAccess = useAccessChecker();
    const [open, setOpen] = useState(false);
    const [jd, setJd] = useState<File>();

    const form = useForm({
        resolver: zodResolver(createJobOpeningFormSchema),
        defaultValues: {
            description: '',
            designationId: '',
            requiredExperience: 0,
            jd: '',
            defaultHrId: '',
            hrs: [],
            reviewers: [],
        },
    });

    const onSubmit = async (data: CreateJobOpeningRequest) => {
        const formData = new FormData();
        formData.append('description', data.description ?? '');
        formData.append('designationId', data.designationId ?? '');
        formData.append(
            'requiredExperience',
            data.requiredExperience?.toString() ?? ''
        );
        formData.append('jd', jd ?? '');
        formData.append('defaultHrId', data.defaultHrId);
        data.hrs?.forEach((x) => formData.append('hrs[]', x));
        data.reviewers?.forEach((x) => formData.append('reviewers[]', x));

        createJobOpeningMutation.mutate(formData, {
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors)
            .map((err) => err?.message)
            .filter((msg): msg is string => msg !== undefined);
        messages.forEach((msg) => toast.error(msg));
    };

    if (!canAccess(visibleTo)) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create job opening</Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[min(700px,85vh)] flex-col gap-0 p-0 sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle>Create job opening</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="px-6 py-4 h-[400px] ">
                            <div className="space-y-5">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Designation*</Label>
                                    <DesignationSelector
                                        setSelectedDesignationId={(
                                            selectedId
                                        ) =>
                                            form.setValue(
                                                'designationId',
                                                selectedId
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="descirption">
                                        Description
                                    </Label>
                                    <Textarea
                                        {...form.register('description')}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <NumberInputWithEndButtons
                                        name="requiredExperience"
                                        control={form.control}
                                        minValue={0}
                                        label="Required Experience (years)"
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="doc">
                                        Job Description*
                                    </Label>
                                    <Input
                                        id="doc"
                                        type="file"
                                        className=""
                                        accept="image/*,.pdf,.doc,.docx"
                                        onChange={(e) =>
                                            setJd(e.target.files?.[0])
                                        }
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="defaultHrId">
                                        Default HR*
                                    </Label>
                                    <DefaultHrSelector
                                        setSelectedHrId={(selectedId) =>
                                            form.setValue(
                                                'defaultHrId',
                                                selectedId
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="hrs">HRs</Label>
                                    <HrsSelector
                                        setSelectedHrIds={(selectedIds) =>
                                            form.setValue('hrs', selectedIds)
                                        }
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="reviewers">Reviewers</Label>
                                    <ReviewersSelector
                                        setSelectedReviewerIds={(selectedIds) =>
                                            form.setValue(
                                                'reviewers',
                                                selectedIds
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
                                disabled={createJobOpeningMutation.isPending}
                            >
                                {createJobOpeningMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Job Opening
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateJobOpeningDialog;
