import { useGetJobOpenings } from '@/api/jobs-api';
import CreateJobOpeningDialog from '@/components/jobOpenings/create-job-opening-dialog';
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
                        Explore job openings share with your network and refer
                        candidates.
                    </p>
                </div>
                <div className="w-[230px] mb-4">
                    <CreateJobOpeningDialog visibleTo={['Admin', 'HR']} />
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-5">
                <div className="w-full flex flex-col items-center">
                    <div className="w-fit">
                        <div className="mx-auto max-w-7xl px-5 py-12 grid gap-8 md:grid-cols-2">
                            {jobOpenings?.map((jobOpening) => (
                                <JobOpeningCard
                                    key={jobOpening.id}
                                    jobOpening={jobOpening}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
