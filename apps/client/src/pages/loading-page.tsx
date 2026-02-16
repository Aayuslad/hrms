import { Spinner } from '@/components/ui/spinner';

function LoadingPage() {
    return (
        <div className="h-screen flex justify-center items-center">
            <Spinner className="size-8" />
        </div>
    );
}

export default LoadingPage;
