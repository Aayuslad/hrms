import { useGetTravelPlan } from '@/api/travel-api';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, Dot, MapPin } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function TravelPlanDetailsPage() {
    const { travelPlanId } = useParams<{ travelPlanId?: string }>();
    const {
        data: travelPlan,
        isLoading,
        isError,
    } = useGetTravelPlan(travelPlanId);

    if (!travelPlan) {
        return <p>travel plan not found.</p>;
    }

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
            <div className="bg  h-[130px] w-full flex items-center">
                <div className="px-10 flex-1 flex items-center gap-6">
                    <div className="">
                        <h1 className="text-2xl font-bold mb-2">
                            {travelPlan?.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-0.5">
                            <span className="flex items-center gap-2">
                                <span>
                                    <MapPin className="h-3 w-3 stroke-2 font-bold" />
                                </span>
                                <span>{travelPlan.destination}</span>
                            </span>

                            <span className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 stroke-2 font-bold" />
                                <span>
                                    {new Date(
                                        travelPlan.startAt as string
                                    ).toLocaleDateString()}{' '}
                                    –{' '}
                                    {new Date(
                                        travelPlan.endAt as string
                                    ).toLocaleDateString()}
                                </span>
                            </span>
                        </div>
                        <div>{travelPlan.description}</div>
                    </div>
                </div>
                <div className="mr-10 mb-4 flex gap-2">
                    {/* <BookSlotDialog
                        gameId={game.id ?? ''}
                        maxPlayers={game.maxSlotPlayers ?? 1}
                    /> */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Other Actions</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            {/* <UpdateGameDialog game={game} /> */}
                            <DropdownMenuSeparator />
                            {/* <DeleteGameDialog gameId={game.id ?? ''} /> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-2 pb-10">
                <div className="w-full flex flex-col items-center px-5"></div>
            </div>
        </div>
    );
}
