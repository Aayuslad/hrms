import { useGetTravelPlans } from '@/api/travel-api';
import CreateTravelPlanDialog from '@/components/travelPlans/create-travel-plan-dialog';
import TravelPlanCard from '@/components/travelPlans/travel-plan-card';
import { Spinner } from '@/components/ui/spinner';

export function Index() {
    const { data: travels, isLoading, isError } = useGetTravelPlans();

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
                Error fetching data
            </div>
        );
    }

    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Travel Plans</h1>
                    <p>
                        Go through your travel plans, view details, and manage
                        them all in one place.
                    </p>
                </div>
                <div className="w-[230px] mb-4">
                    <CreateTravelPlanDialog visibleTo={['Admin', 'HR']} />
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-5">
                <div className="w-full flex flex-col items-center">
                    <div className="w-fit">
                        <div className="mx-auto max-w-7xl px-5 py-12 grid gap-8 md:grid-cols-2">
                            {travels?.map((travel) => (
                                <TravelPlanCard travelPlan={travel} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
