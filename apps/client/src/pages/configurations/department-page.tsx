import { CreateDepartmentDialog } from '@/components/configurations/departments/create-department-dialog';
import { DeleteDepartmentDialog } from '@/components/configurations/departments/delete-department-dialog';
import { DepartmentsTable } from '@/components/configurations/departments/departments-table';
import { UpdateDepartmentDialog } from '@/components/configurations/departments/update-department-dialog';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

export function DepartmentPage() {
    const { openConfigDialog } = useAppStore(
        useShallow((s) => ({
            openConfigDialog: s.openConfigDialog,
        }))
    );

    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Departments</h1>
                    <p>Structure teams into clear functional business units.</p>
                </div>
                <div className="w-[230px] mb-4">
                    <Button
                        variant="secondary"
                        className="border"
                        onClick={() =>
                            openConfigDialog({
                                entity: 'departments',
                                mode: 'create',
                            })
                        }
                    >
                        + Create Department
                    </Button>
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-10">
                <div className="w-full flex flex-col items-center">
                    <div className="mr-12 w-fit">
                        <DepartmentsTable />
                    </div>
                </div>
            </div>

            <CreateDepartmentDialog visibleTo={['Admin', 'HR']} />
            <UpdateDepartmentDialog />
            <DeleteDepartmentDialog />
        </div>
    );
}
