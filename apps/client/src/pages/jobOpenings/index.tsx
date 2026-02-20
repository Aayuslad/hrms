import { useGetJobOpenings } from '@/api/jobs-api';
import JobOpeningCard from '@/components/jobOpenings/job-opening-card';
import { Spinner } from '@/components/ui/spinner';

export function Index() {
    const { data: jobOpenings, isLoading, isError } = useGetJobOpenings();

    if (isLoading) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                Error fetching data...!
            </div>
        );
    }

    if (!isLoading && !isError && !jobOpenings) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                404 - Not found...!
            </div>
        );
    }

    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
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
                        {jobOpenings?.map((jobOpening) => (
                            <JobOpeningCard jobOpening={jobOpening} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
