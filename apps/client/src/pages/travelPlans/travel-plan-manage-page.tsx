import { useGetTravelPlan } from '@/api/travel-api';
import { useGetMe } from '@/api/user-api';
import DeleteTravelPlanDialog from '@/components/travelPlans/delete-travel-plan-dialog';
import { ViewProofsDialog } from '@/components/travelPlans/expense/view-proofs-dialog';
import { ApproveExpenseDialog } from '@/components/travelPlans/expense/approve-expense-dialog';
import { RejectExpenseDialog } from '@/components/travelPlans/expense/reject-expense-dialog';
import { AllExpenses } from '@/components/travelPlans/tabContents/all-expenses';
import { MyDocuments } from '@/components/travelPlans/tabContents/my-documents';
import { MyExpenses } from '@/components/travelPlans/tabContents/my-expenses';
import { Participants } from '@/components/travelPlans/tabContents/participants';

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
import { useAccessChecker } from '@/hooks/use-has-access';
import { Calendar, Dot, MapPin, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { NoContent } from '@/components/no-content';

export function TravelPlanManagePage() {
    const canAccess = useAccessChecker();
    const [descriptionView, setDescriptionView] = useState<'short' | 'full'>(
        'short'
    );
    const { data: me } = useGetMe();
    const { travelPlanId } = useParams<{ travelPlanId?: string }>();
    const {
        data: travelPlan,
        isLoading,
        isError,
    } = useGetTravelPlan(travelPlanId);

    const tabs = [
        {
            name: (
                <div>
                    Participants ({travelPlan?.participants?.length || 0})
                </div>
            ),
            value: 'participants',
            content: <Participants travelPlanId={travelPlanId!} />,
            roles: ['Employee', 'Admin', 'HR'],
            onlyShowToParticipants: false,
        },
        {
            name: 'All Expenses',
            value: 'all-expenses',
            content: <AllExpenses travelPlanId={travelPlanId!} />,
            roles: ['Admin', 'HR'],
            onlyShowToParticipants: false,
        },
    ];

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

    if (!isLoading && !isError && !travelPlan) {
        return <NoContent />;
    }

    return (
        <div className=" h-full">
            <div className="bg  h-[130px] w-full flex items-center">
                <div className="px-10 flex-1 flex items-center gap-6">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {travelPlan?.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span>{travelPlan.destination}</span>
                            </div>

                            <Dot />

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span>
                                    {new Date(
                                        travelPlan.startAt as string
                                    ).toLocaleString()}
                                    {' – '}
                                    {new Date(
                                        travelPlan.endAt as string
                                    ).toLocaleString()}
                                </span>
                            </div>

                            <Dot />

                            <div className="flex items-center gap-2">
                                <Wallet className="h-4 w-4 shrink-0" />
                                <span>
                                    ₹{travelPlan.maxExpenseAmountPerDay} / day
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mr-10 mb-4 flex gap-2">
                    {canAccess(['Admin', 'HR']) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Other Actions</Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <UpdateTravelPlanDialog
                                    travelPlan={travelPlan}
                                />
                                <DropdownMenuSeparator />
                                <DeleteTravelPlanDialog
                                    travelPlanId={travelPlan.id}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-2 pb-10">
                <div className="w-full mr-12 flex flex-col items-center px-8 space-y-10">
                    <p className="text-sm px-2 w-full text-foreground/90 leading-relaxed">
                        {descriptionView === 'short'
                            ? travelPlan.description?.slice(0, 100) + '...'
                            : travelPlan.description}
                        <button
                            className="ml-2 text-sm text-blue-500 hover:underline cursor-pointer"
                            onClick={() =>
                                setDescriptionView(
                                    descriptionView === 'short'
                                        ? 'full'
                                        : 'short'
                                )
                            }
                        >
                            {descriptionView === 'short'
                                ? 'read more'
                                : 'read less'}
                        </button>
                    </p>

                    <div className="w-[850px]">
                        <Tabs defaultValue={tabs[0].value} className="gap-4">
                            <TabsList className="bg-background rounded-none border-b w-full p-0">
                                {tabs.map((tab) => {
                                    if (!canAccess(tab.roles)) {
                                        return null;
                                    }

                                    if (
                                        tab.onlyShowToParticipants &&
                                        !travelPlan?.participants?.some(
                                            (p) => p.id === me?.id
                                        )
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
                                        >
                                            {tab.name}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>

                            {tabs.map((tab) => {
                                if (!canAccess(tab.roles)) {
                                    return null;
                                }

                                if (
                                    tab.onlyShowToParticipants &&
                                    !travelPlan?.participants?.some(
                                        (p) => p.id === me?.id
                                    )
                                ) {
                                    return null;
                                }

                                return (
                                    <TabsContent
                                        key={tab.value}
                                        value={tab.value}
                                    >
                                        <p className="text-muted-foreground text-sm">
                                            {tab.content}
                                        </p>
                                    </TabsContent>
                                );
                            })}
                        </Tabs>
                    </div>
                </div>
            </div>

            <ViewProofsDialog />
            <ApproveExpenseDialog />
            <RejectExpenseDialog />
        </div>
    );
}
