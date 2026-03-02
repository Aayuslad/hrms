import { useGetRoles } from '@/api/role-api';
import {
    useEditUserRoles,
    type UpdateUserRolesRequest,
    type User,
} from '@/api/user-api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useShallow } from 'zustand/react/shallow';

const updateEmployeeRolesFormSchema = z.object({
    userId: z.string(),
    roles: z.array(z.string()).optional(),
}) satisfies z.ZodType<UpdateUserRolesRequest>;

export function UpdateEmployeeRolesDialog() {
    const updateRolesMutation = useEditUserRoles();
    const { configDialogOpen, configDialogTarget, closeConfigDialog } =
        useAppStore(
            useShallow((s) => ({
                configDialogOpen: s.configDialogOpen,
                configDialogTarget: s.configDialogTarget,
                closeConfigDialog: s.closeConfigDialog,
            }))
        );

    const user = configDialogTarget?.payload as User | undefined;

    const { data: roles } = useGetRoles();
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        user?.roles?.map((r) => r.id!).filter(Boolean) || []
    );

    useEffect(() => {
        setSelectedRoles(user?.roles?.map((r) => r.id!).filter(Boolean) || []);
    }, [user]);

    const form = useForm<UpdateUserRolesRequest>({
        resolver: zodResolver(updateEmployeeRolesFormSchema),
        defaultValues: {
            userId: user?.id ?? '',
            roles: selectedRoles,
        },
    });

    useEffect(() => {
        form.setValue('userId', user?.id ?? '');
        form.setValue('roles', selectedRoles);
    }, [user, selectedRoles, form]);

    const onSubmit = async () => {
        const data: UpdateUserRolesRequest = {
            userId: user?.id!,
            roles: selectedRoles,
        };
        updateRolesMutation.mutate(
            { userId: data.userId, payload: data },
            {
                onSuccess: () => {
                    closeConfigDialog();
                },
            }
        );
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        const messages = Object.values(errors).map((err) => err.message);
        messages
            .slice()
            .reverse()
            .forEach((msg) => toast.error(msg));
    };

    return (
        <Dialog
            open={
                configDialogOpen &&
                configDialogTarget?.entity === 'employees' &&
                configDialogTarget?.mode === 'update-roles'
            }
            onOpenChange={(state) => state === false && closeConfigDialog()}
        >
            <DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:w-[300px]">
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="flex flex-col h-full"
                >
                    <DialogHeader className="contents space-y-0 text-left">
                        <DialogHeader>
                            <DialogTitle className="px-6 pt-6">
                                Update Employee Roles
                            </DialogTitle>
                        </DialogHeader>
                    </DialogHeader>

                    <div className="grid gap-4 px-6 py-6">
                        <div className="grid gap-3">
                            <div className="space-y-2">
                                {roles?.map((role) => (
                                    <div
                                        key={role.id!}
                                        className="flex items-center justify-between space-x-2"
                                    >
                                        <Label htmlFor={role.id!}>
                                            {role.name}
                                        </Label>
                                        <Checkbox
                                            id={role.id!}
                                            checked={selectedRoles.includes(
                                                role.id!
                                            )}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedRoles([
                                                        ...selectedRoles,
                                                        role.id!,
                                                    ]);
                                                } else {
                                                    setSelectedRoles(
                                                        selectedRoles.filter(
                                                            (id) =>
                                                                id !== role.id!
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4">
                        <Button
                            variant="outline"
                            type="button"
                            disabled={updateRolesMutation.isPending}
                            onClick={() => closeConfigDialog()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateRolesMutation.isPending}
                        >
                            {updateRolesMutation.isPending && (
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
