import { useGetGame, type Game } from '@/api/games-api';
import Schedule from '@/components/games/chedule';
import DeleteGameDialog from '@/components/games/gameDialogs/delete-game-dialog';
import UpdateGameDialog from '@/components/games/gameDialogs/update-game-dialog';
import BookSlotDialog from '@/components/games/slotDialogs/book-slot-dialog';
import { NoContent } from '@/components/no-content';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { useAccessChecker } from '@/hooks/use-has-access';
import { Calendar, Clock, Dot, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function GameDetailsPage() {
    const { gameId } = useParams<{ gameId?: string }>();
    const { data: game, isLoading, isError } = useGetGame(gameId);
    const canAccess = useAccessChecker();

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

    if (!isLoading && !isError && !game) {
        return <NoContent />;
    }

    return (
        <div className=" h-full">
            <div className="bg  h-[110px] w-full flex items-center">
                <div className="px-8 pr-5 flex-1 flex items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold">{game?.name}</h1>
                        <div className="flex flex-wrap items-center gap- text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <span>
                                    <Clock className="h-3 w-3 stroke-2 font-bold" />
                                </span>
                                <span>{game?.slotDuration} mins / slot</span>
                            </span>

                            <Dot />

                            <span className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>Max {game?.maxSlotPlayers} players</span>
                            </span>

                            <Dot />

                            <span className="flex items-center gap-2">
                                <Clock className="h-3 w-3 stroke-2 font-bold" />
                                <span>
                                    {game?.openTime} – {game?.closeTime}
                                </span>
                            </span>

                            <Dot />

                            <span className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {game?.openingDayOfWeek} –{' '}
                                    {game?.closingDayOfWeek}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mr-10 mb-4 flex gap-2">
                    <BookSlotDialog
                        gameId={game?.id ?? ''}
                        maxPlayers={game?.maxSlotPlayers ?? 1}
                    />
                    {canAccess(['Admin', 'HR']) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Other Actions</Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <UpdateGameDialog game={game as Game} />
                                <DropdownMenuSeparator />
                                <DeleteGameDialog gameId={game?.id ?? ''} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-2 pb-10">
                <div className="w-full flex flex-col items-center pl-5 pr-3">
                    {game ? (
                        <Schedule
                            game={game}
                            weekStartsOn={1}
                            referenceDate={new Date()}
                        />
                    ) : (
                        <p>Loading schedule…</p>
                    )}
                </div>
            </div>
        </div>
    );
}
