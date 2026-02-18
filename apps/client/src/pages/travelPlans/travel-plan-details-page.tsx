import { useGetTravelPlan } from '@/api/travel-api';
import DeleteTravelPlanDialog from '@/components/travelPlans/delete-travel-plan-dialog';
import { MyDocuments } from '@/components/travelPlans/my-documents';
import { MyExpenses } from '@/components/travelPlans/my-expenses';
import { Participants } from '@/components/travelPlans/participants';
import UpdateTravelPlanDialog from '@/components/travelPlans/update-travel-plan-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin } from 'lucide-react';
import { useParams } from 'react-router-dom';

const tabs = [
    {
        name: 'My Expenses',
        value: 'my-expenses',
        content: <MyExpenses />,
    },
    {
        name: 'My Documents',
        value: 'my-documents',
        content: <MyDocuments />,
    },
    {
        name: 'Participants',
        value: 'participants',
        content: <Participants />,
    },
];

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
                                    ).toLocaleString()}{' '}
                                    –{' '}
                                    {new Date(
                                        travelPlan.endAt as string
                                    ).toLocaleString()}
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
                            <UpdateTravelPlanDialog travelPlan={travelPlan} />
                            <DropdownMenuSeparator />
                            <DeleteTravelPlanDialog
                                travelPlanId={travelPlan.id}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-2 pb-10">
                <div className="w-full flex flex-col items-center px-8">
                    <div className="w-[700px]">
                        <Tabs defaultValue="explore" className="gap-4">
                            <TabsList className="bg-background rounded-none border-b p-0">
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
                                    >
                                        {tab.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {tabs.map((tab) => (
                                <TabsContent key={tab.value} value={tab.value}>
                                    <p className="text-muted-foreground text-sm">
                                        {tab.content}
                                    </p>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
