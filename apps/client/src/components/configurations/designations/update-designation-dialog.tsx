import {
    useUpdateDesignation,
    type Designation,
    type UpdateDesignationRequest,
} from '@/api/designation-api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';
import { Loader2 } from 'lucide-react';

const updateDesignationFormSchema = z.object({
    id: z.string().nonempty('Designation ID is required'),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
}) satisfies z.ZodType<UpdateDesignationRequest>;

export function UpdateDesignationDialog() {
    const location = useLocation();
    const designation = location.state as Designation;
    const updateDesignationMutation = useUpdateDesignation();
    const navigate = useNavigate();

    const form = useForm<UpdateDesignationRequest>({
        resolver: zodResolver(updateDesignationFormSchema),
        defaultValues: {
            id: designation.id,
            name: designation.name,
        },
    });

    const onSubmit = async (data: UpdateDesignationRequest) => {
        updateDesignationMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                navigate('/configuration/designations');
            },
        });
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages
            .slice()
            .reverse()
            .forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-[425px]">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="grid gap-7"
                >
                    <DialogHeader>
                        <DialogTitle>Update Designation</DialogTitle>
                        <DialogDescription>
                            Update the designation details and click Save.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...form.register('name')} />
                        </div>
                    </div>

                    <DialogFooter>
                        <div>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={updateDesignationMutation.isPending}
                                onClick={() =>
                                    navigate('/configuration/designations')
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={updateDesignationMutation.isPending}
                        >
                            {updateDesignationMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
