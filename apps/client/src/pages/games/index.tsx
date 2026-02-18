import { useGetGames } from '@/api/games-api';
import CreateGameDialog from '@/components/games/create-game-dialog';
import GameCard from '@/components/games/game-card';
import { Spinner } from '@/components/ui/spinner';

export function Index() {
    const { data: games, isLoading, isError } = useGetGames();

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

    if (!isLoading && !isError && !games) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                404 - Not found...!
            </div>
        );
    }

    return (
        <div className=" h-full">
            <div className="bg-muted h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Games</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Aut, voluptatum.
                    </p>
                </div>
                <div className="w-[230px] mb-4">
                    <CreateGameDialog />
                </div>
            </div>

            <div className="w-full flex justify-evenly py-5 px-8">
                <div className="w-full flex flex-col items-center">
                    <div className="mx-auto max-w-7xl px-5 py-12 grid gap-8 md:grid-cols-2">
                        {games?.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
