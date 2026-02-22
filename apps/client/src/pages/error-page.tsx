import { useRouteError } from 'react-router';

export function ErrorPage() {
    const error = useRouteError() as Error;

    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Oops!</h1>
            <p className="mb-4">Sorry, an unexpected error has occurred.</p>
            <p className="text-sm text-muted-foreground">
                <i>{error.message}</i>
            </p>
        </div>
    );
}