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
        <Card className="border-primary w-[400px]  gap-2 bg-transparent shadow-none">
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle className="font-bold text-2xl">
                        {travelPlan.title}
                    </CardTitle>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`${travelPlan.id}`);
                        }}
                        className="bg-gradient-to-br from-purple-500 to-pink-500 text-white focus-visible:ring-pink-600/20"
                    >
                        Explore More
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <div className="flex gap-6 text-sm  text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span>
                            <MapPin className="h-4 w-4" />
                        </span>
                        <span>{travelPlan.destination}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>
                            <Calendar className="h-4 w-4" />
                        </span>
                        <span>
                            {new Date(
                                travelPlan.startAt as string
                            ).toLocaleDateString()}{' '}
                            –{' '}
                            {new Date(
                                travelPlan.endAt as string
                            ).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div>{travelPlan.description}</div>
            </CardContent>
        </Card>
    );
};

export default TravelPlanCard;
