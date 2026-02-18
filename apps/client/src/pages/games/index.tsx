import { useLoaderData } from 'react-router-dom';
import { useGetGames, type GameSummary } from '@/api/games-api';
import GameCard from '@/components/games/game-card';
import { Spinner } from '@/components/ui/spinner';
import CreateGameDialog from '@/components/games/create-game-dialog';

export function Index() {
    const initialData = useLoaderData<GameSummary[]>();
    const {
        data = initialData,
        isLoading,
        isError,
    } = useGetGames({
        initialData,
    });

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
                        {data?.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
