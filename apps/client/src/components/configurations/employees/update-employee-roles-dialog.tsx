import { useGetRoles } from '@/api/role-api';
import { useEditUserRoles, type UpdateUserRolesRequest, type User } from '@/api/user-api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';

const updateEmployeeRolesFormSchema = z.object({
    userId: z.string(),
    roles: z.array(z.string()).optional(),
}) satisfies z.ZodType<UpdateUserRolesRequest>;

export function UpdateEmployeeRolesDialog() {
    const location = useLocation();
    const user = location.state.user as User;
    const updateRolesMutation = useEditUserRoles();
    const navigate = useNavigate();

    const { data: roles } = useGetRoles();
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        user.roles?.map((r) => r.id!).filter(Boolean) || []
    );

    const form = useForm<UpdateUserRolesRequest>({
        resolver: zodResolver(updateEmployeeRolesFormSchema),
        defaultValues: {
            userId: user.id!,
            roles: selectedRoles,
        },
    });

    const onSubmit = async () => {
        const data: UpdateUserRolesRequest = {
            userId: user.id!,
            roles: selectedRoles,
        };
        updateRolesMutation.mutate(
            { userId: user.id!, payload: data },
            {
                onSuccess: () => {
                    navigate('/configuration/employees');
                },
            }
        );
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages.slice().reverse().forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog open={true}>
            <DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-sm">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="flex flex-col h-full"
                >
                    <DialogHeader className="contents space-y-0 text-left">
                        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
                            <DialogTitle className="px-6 pt-6">Update Employee Roles</DialogTitle>
                            <DialogDescription asChild>
                                <div className="p-6">
                                    Update the employee roles and click Save.
                                </div>
                            </DialogDescription>
                            <div className="grid gap-4 px-6 pb-6">
                                <div className="grid gap-3">
                                    <Label>Roles</Label>
                                    <div className="space-y-2">
                                        {roles?.map((role) => (
                                            <div key={role.id!} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={role.id!}
                                                    checked={selectedRoles.includes(role.id!)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedRoles([...selectedRoles, role.id!]);
                                                        } else {
                                                            setSelectedRoles(
                                                                selectedRoles.filter((id) => id !== role.id!)
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor={role.id!}>{role.name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </DialogHeader>
                    <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4">
                        <Button
                            variant="outline"
                            type="button"
                            disabled={updateRolesMutation.isPending}
                            onClick={() => navigate('/configuration/employees')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateRolesMutation.isPending}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}