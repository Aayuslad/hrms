import { useGetGames, useGetOffers } from '@/api/games-api';
import GameCard from '@/components/games/cards/game-card';
import { OfferCard } from '@/components/games/cards/offer-card';
import CreateGameDialog from '@/components/games/gameDialogs/create-game-dialog';
import { NoContent } from '@/components/no-content';
import { Spinner } from '@/components/ui/spinner';

export function Index() {
    const { data: games, isLoading, isError } = useGetGames();
    const { data: offers } = useGetOffers();

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

    return (
        <div className=" h-full">
            <div className="bg-muted h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Games</h1>
                    <p>Explore your gaming world! Dive into your collection.</p>
                </div>
                <div className="w-[230px] mb-4">
                    <CreateGameDialog visibleTo={['Admin', 'HR']} />
                </div>
            </div>

            <div className="w-full flex justify-evenly py-5 px-8">
                <div className="w-full mr-4 flex flex-col items-center">
                    <div className="mx-auto px-5 py-12 gap-8">
                        {offers?.length !== 0 &&
                            offers?.some(
                                (offer) => offer.status === 'PENDING'
                            ) && (
                                <div className="mb-10">
                                    <h2 className="text-xl font-bold mb-4">
                                        Offers
                                    </h2>
                                    {offers && offers.length > 0 && (
                                        <div className="w-full flex flex-wrap gap-3">
                                            {offers
                                                .filter(
                                                    (offer) =>
                                                        offer.status ===
                                                        'PENDING'
                                                )
                                                .map((offer) => (
                                                    <OfferCard
                                                        key={offer.id}
                                                        offer={offer}
                                                    />
                                                ))}
                                        </div>
                                    )}
                                </div>
                            )}

                        <div className="w-full grid gap-8 md:grid-cols-2">
                            {games?.map((game) => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>

                        {!games && !offers && <NoContent />}
                    </div>
                </div>
            </div>
        </div>
    );
}
