import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

export function ViewProofsDialog() {
    const { proofsDialogOpen, proofsToShow, closeProofsDialog } = useAppStore(
        useShallow((s) => ({
            proofsDialogOpen: s.proofsDialogOpen,
            proofsToShow: s.proofsToShow,
            closeProofsDialog: s.closeProofsDialog,
        }))
    );

    const proofs = proofsToShow ?? [];

    return (
        <Dialog open={proofsDialogOpen} onOpenChange={closeProofsDialog}>
            <DialogContent className="max-w-3xl w-full h-fit p-0 bg-transparent border-none [&>button]:hidden">
                {proofs.length ? (
                    <Carousel className="w-full h-full p-0 flex items-center justify-center">
                        <CarouselContent className="h-full flex items-center justify-start">
                            {proofs.map((proof, index) => (
                                <CarouselItem
                                    key={proof.id ?? index}
                                    className="h-full"
                                >
                                    <Card className="w-full h-full bg-transparent border-none">
                                        <CardContent className="flex items-center justify-center p-0 h-full">
                                            {proof.docUrl ? (
                                                <img
                                                    src={proof.docUrl}
                                                    alt={`proof-${index + 1}`}
                                                    className="max-h-[90%] max-w-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-4xl font-semibold">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                ) : (
                    <p className="p-4 text-center text-muted-foreground">
                        No proofs available.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
