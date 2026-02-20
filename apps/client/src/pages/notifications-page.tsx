import { useGetNotificationns } from '@/api/user-api';
import { Spinner } from '@/components/ui/spinner';
import { no } from 'zod/v4/locales';

export function NotificationsPage() {
    const { data: notifications, isLoading, isError } = useGetNotificationns();

    if (!notifications) {
        return <p>notifications not found.</p>;
    }

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
        <div className="p-4">
            {notifications?.map((n) => (
                <p key={n.id}>{n.content}</p>
            ))}
        </div>
    );
}
