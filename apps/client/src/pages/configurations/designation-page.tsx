import { CreateDesignationDialog } from '@/components/configurations/designations/create-designation-dialog';
import { DesignationsTable } from '@/components/configurations/designations/designations-table';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { UpdateDesignationDialog } from '@/components/configurations/designations/update-designation-dialog';
import { DeleteDesignationDialog } from '@/components/configurations/designations/delete-designation-dialog';

export function DesignationPage() {
    const { openConfigDialog } = useAppStore(
        useShallow((s) => ({
            openConfigDialog: s.openConfigDialog,
        }))
    );

    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Designations</h1>
                    <p>
                        Define job titles and organizational hierarchy levels.
                    </p>
                </div>
                <div className="w-[230px] mb-4">
                    <Button variant="secondary" className="border" onClick={() => openConfigDialog({ entity: 'designations', mode: 'create' })}>
                        + Create Designation
                    </Button>
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-10">
                <div className="w-full flex flex-col items-center">
                    <div className="mr-12 w-fit">
                        <DesignationsTable />
                        <Outlet />
                    </div>
                </div>
            </div>

            <CreateDesignationDialog visibleTo={['Admin', 'HR']} />
            <UpdateDesignationDialog />
            <DeleteDesignationDialog />
        </div>
    );
}
