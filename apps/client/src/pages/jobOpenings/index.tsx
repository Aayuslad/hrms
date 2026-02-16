
export function Index() {
    return (
        <div className=" h-full">
            <div className="bg-muted dark:bg-slate-800/40 h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Job Openings</h1>
                    <p>
                        Manage all job openings and their interview workflows.
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
