import type { TravelPlanSummary } from '@/api/travel-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

type Props = {
    travelPlan: TravelPlanSummary;
};

const TravelPlanCard = ({ travelPlan }: Props) => {
    const navigate = useNavigate();

    return (
        <Card className="w-[420px] border-primary/40 bg-transparent shadow-none p-6 rounded-2xl">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold leading-tight">
                        {travelPlan.title}
                    </CardTitle>
                </div>

                <Button
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${travelPlan.id}`);
                    }}
                    variant={'outline'}
                >
                    Explore More
                </Button>
            </div>

            {/* CONTENT */}
            <CardContent className="px-0 pt-4 space-y-4">
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
                    {travelPlan.description}
                </p>
            </CardContent>
        </Card>
    );
};

export default TravelPlanCard;
