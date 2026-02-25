import type { GameSummary } from '@/api/games-api';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Props = {
    game: GameSummary;
};

const GameCard = ({ game }: Props) => {
    const navigate = useNavigate();

    return (
        <Card
            className={`w-[400px] py-0 cursor-pointer hover:shadow-lg transition-shadow sm:flex sm:gap-0 sm:flex-col`}
        >
            <CardHeader className="pt-6 w-full">
                <div className="flex justify-between  ">
                    <CardTitle className="font-bold text-2xl">
                        {game.name}
                    </CardTitle>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`${game.id}`);
                        }}
                        className=""
                        variant={'outline'}
                    >
                        Explore More
                    </Button>
                </div>
            </CardHeader>

            <CardDescription className="mt-3 space-y-2  pl-8 text-sm text-muted-foreground">
                <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-2">
                        <span>
                            <Clock className="h-3 w-3 stroke-2 font-bold" />
                        </span>
                        <span>{game.slotDuration} mins / slot</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>Max {game.maxSlotPlayers} players</span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span>
                        <Clock className="h-4 w-4" />
                    </span>
                    <span>
                        {game.openTime} – {game.closeTime}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span>
                        <Calendar className="h-4 w-4" />
                    </span>
                    <span>
                        {game.openingDayOfWeek} – {game.closingDayOfWeek}
                    </span>
                </div>
            </CardDescription>

            <CardFooter className="gap-3 py-3"></CardFooter>
        </Card>
    );
};

export default GameCard;
