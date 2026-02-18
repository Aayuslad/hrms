export function DepartmentPage() {
    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Departments</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Aut, voluptatum.
                    </p>
                </div>
                <div className="w-[230px] mb-4">
                    {/* <CreateJobOpeningSheet visibleTo={['Admin', 'Recruiter']} /> */}
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-10">
                <div className="w-full flex flex-col items-center">
                    <div className="mr-12 w-fit">
                        {/* <JobOpeningsTable /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
