import type { TravelPlanSummary } from '@/api/travel-api';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAccessChecker } from '@/hooks/use-has-access';

type Props = {
    travelPlan: TravelPlanSummary;
};

const TravelPlanCard = ({ travelPlan }: Props) => {
    const navigate = useNavigate();
    const canAccess = useAccessChecker();

    return (
        <Card className="w-[420px] shadow-none p-6 rounded-2xl">
            {/* HEADER */}
            <div className="">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold leading-tight">
                        {travelPlan.title}
                    </CardTitle>
                </div>
            </div>

            {/* CONTENT */}
            <CardContent className="px-0  space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                    {/* Destination */}
                    <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{travelPlan.destination}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3">
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
                </div>

                {/* Divider */}
                <div className="h-px bg-border/50" />

                {/* Description */}
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {travelPlan.description?.slice(0, 100)}...
                </p>

                <div className="flex gap-2">
                    {travelPlan.meParticipant && (
                        <Button
                            size="sm"
                            className="flex-[50%]"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`${travelPlan.id}`, {
                                    state: {
                                        childBreadCrumbName: travelPlan.title,
                                    },
                                });
                            }}
                            variant={'outline'}
                        >
                            <User />
                            My details
                        </Button>
                    )}

                    {canAccess(['Admin', 'HR']) && (
                        <Button
                            size="sm"
                            className="flex-[50%]"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`${travelPlan.id}/manage`, {
                                    state: {
                                        childBreadCrumbName: travelPlan.title,
                                    },
                                });
                            }}
                            variant={'outline'}
                        >
                            <Settings />
                            Manage
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TravelPlanCard;
