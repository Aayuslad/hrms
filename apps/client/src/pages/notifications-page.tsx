import { useGetNotificationns, useMarkNotificationsAsRead } from '@/api/user-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useMemo } from 'react';

export function NotificationsPage() {
    const { data: notifications, isLoading, isError } = useGetNotificationns();
    const markAsReadMutation = useMarkNotificationsAsRead();

    // Sort notifications in reverse chronological order
    const sortedNotifications = useMemo(() => {
        if (!notifications) return [];
        return [...notifications].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });
    }, [notifications]);

    // Get unread notification IDs
    const unreadNotificationIds = useMemo(() => {
        return sortedNotifications
            .filter((n) => !n.isRead)
            .map((n) => n.id)
            .filter((id): id is string => id !== undefined);
    }, [sortedNotifications]);

    const handleMarkAllAsRead = async () => {
        if (unreadNotificationIds.length === 0) return;
        await markAsReadMutation.mutateAsync(unreadNotificationIds);
    };

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
                <p className="text-destructive">Error fetching notifications</p>
            </div>
        );
    }

    if (!sortedNotifications || sortedNotifications.length === 0) {
        return (
            <div className="p-6">
                <p className="text-center text-muted-foreground">
                    No notifications found.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-end">
                {/* <h2 className="text-2xl font-bold">Notifications</h2> */}
                {unreadNotificationIds.length > 0 && (
                    <Button
                        onClick={handleMarkAllAsRead}
                        disabled={markAsReadMutation.isPending}
                        variant="outline"
                    >
                        {markAsReadMutation.isPending
                            ? 'Marking...'
                            : `Mark All as Read (${unreadNotificationIds.length})`}
                    </Button>
                )}
            </div>

            <div className="space-y-3 w-[750px] pr-16 mt-10 mx-auto">
                {sortedNotifications.map((notification) => (
                    <Card
                        key={notification.id}
                        className={`transition-colors pb-3 pt-4 ${
                            notification.isRead
                                ? 'bg-muted/30 border-muted-foreground/20'
                                : 'bg-primary/5 border-primary/30'
                        }`}
                    >
                        <CardContent className="px-5 bo">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`inline-flex size-2 rounded-full ${
                                                notification.isRead
                                                    ? 'bg-muted-foreground/50'
                                                    : 'bg-primary'
                                            }`}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {notification.createdAt
                                                ? new Date(
                                                      notification.createdAt
                                                  ).toLocaleString()
                                                : 'Just now'}
                                        </p>
                                    </div>
                                    <p
                                        className={`text-base ${
                                            notification.isRead
                                                ? 'text-muted-foreground'
                                                : 'font-medium text-foreground'
                                        }`}
                                    >
                                        {notification.content}
                                    </p>
                                </div>
                                <div className="flex flex-col-reverse items-end gap-2">
                                    {!notification.isRead && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => markAsReadMutation.mutate([notification.id!])}
                                            disabled={markAsReadMutation.isPending}
                                        >
                                            Mark as Read
                                        </Button>
                                    )}
                                    {!notification.isRead && (
                                        <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                            New
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
