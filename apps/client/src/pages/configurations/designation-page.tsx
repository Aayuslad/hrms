import { CreateDesignationDialog } from '@/components/configurations/designations/create-designation-dialog';
import { DesignationsTable } from '@/components/configurations/designations/designations-table';
import { Outlet } from 'react-router';

export function DesignationPage() {
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
                    <CreateDesignationDialog visibleTo={['Admin', 'HR']} />
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
        </div>
    );
}
