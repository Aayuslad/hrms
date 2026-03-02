import { EmployeesTable } from '@/components/configurations/employees/employees-table';
import { UpdateEmployeeDialog } from '@/components/configurations/employees/update-employee-dialog';
import { UpdateEmployeeRolesDialog } from '@/components/configurations/employees/update-employee-roles-dialog';

export function EmployeePage() {
    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <p>
                        Manage employee profiles, roles, and other work details.
                    </p>
                </div>
                <div className="w-[230px] mb-4">
                    {/* <CreateEmployeeDialog visibleTo={['Admin', 'HR']} /> */}
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-10">
                <div className="w-full flex flex-col items-center">
                    <div className="w-fit">
                        <EmployeesTable />
                    </div>
                </div>
            </div>

            <UpdateEmployeeDialog />
            <UpdateEmployeeRolesDialog />
        </div>
    );
}
