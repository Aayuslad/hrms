import { useGetGame, type Game } from '@/api/games-api';
import BookSlotDialog from '@/components/games/book-slot-dialog';
import Schedule from '@/components/games/chedule';
import DeleteGameDialog from '@/components/games/delete-game-dialog';
import UpdateGameDialog from '@/components/games/update-game-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Clock, Dot, Users } from 'lucide-react';
import { useLoaderData, useParams } from 'react-router-dom';

export function GameDetailsPage() {
    const { gameId } = useParams<{ gameId?: string }>();
    const initialData = useLoaderData<Game | null>();
    const { data: game } = useGetGame(gameId, { initialData });

    if (!game) {
        return <p>Game not found.</p>;
    }

    const handleEdit = () => {};

    const handleDelete = () => {};

    return (
        <div className=" h-full">
            <div className="bg  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1 flex items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold">{game?.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <span>
                                    <Clock className="h-3 w-3 stroke-2 font-bold" />
                                </span>
                                <span>{game.slotDuration} mins / slot</span>
                            </span>

                            <Dot />

                            <span className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>Max {game.maxSlotPlayers} players</span>
                            </span>

                            <Dot />

                            <span className="flex items-center gap-2">
                                <Clock className="h-3 w-3 stroke-2 font-bold" />
                                <span>
                                    {game.openTime} – {game.closeTime}
                                </span>
                            </span>

                            <Dot />

                            <span className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {game.openingDayOfWeek} –{' '}
                                    {game.closingDayOfWeek}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mr-10 mb-4 flex gap-2">
                    <BookSlotDialog gameId={game.id ?? ''} maxPlayers={game.maxSlotPlayers ?? 1} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Other Actions</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <UpdateGameDialog game={game} />
                            <DropdownMenuSeparator />
                            <DeleteGameDialog gameId={game.id ?? ''} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-2 pb-10">
                <div className="w-full flex flex-col items-center px-5">
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
