import { Separator } from '@radix-ui/react-separator';
import { SidebarTrigger } from './ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from './ui/breadcrumb';
import { ThemeToggleButton } from './ui/theme-toggle-button';
import { BellIcon } from './ui/bell-icon';
import { useGetNotificationns } from '@/api/user-api';
import { useBreadCrumbs } from '@/hooks/use-bread-crumbs';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';

function AppHeader() {
    const { data: notifications } = useGetNotificationns();
    const unreadCount = notifications?.filter((n) => !n.isRead)?.length || 0;
    const breadcrumbs = useBreadCrumbs();
    const navigate = useNavigate();
    const { toggleSidebar } = useAppStore(
        useShallow((s) => ({
            toggleSidebar: s.toggleSidebarState,
        }))
    );

    return (
        <header className="flex h-13 shrink-0 items-center gap-2 border-b w-full">
            <div className="flex items-center gap-2 px-3 w-full ">
                <SidebarTrigger
                    className="hover:cursor-pointer"
                    onClick={() => toggleSidebar()}
                />

                <Separator orientation="vertical" className="mr-2 h-4" />

                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((bc, index) => (
                            <BreadcrumbItem key={bc.path || bc.label || index}>
                                {index < breadcrumbs.length - 1 ? (
                                    <BreadcrumbLink
                                        className="hover:cursor-pointer"
                                        onClick={() => navigate(bc.path)}
                                    >
                                        {bc.label}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{bc.label}</BreadcrumbPage>
                                )}

                                {index < breadcrumbs.length - 1 && (
                                    <BreadcrumbSeparator className="hidden -mb-1 -mr-1 md:block" />
                                )}
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <Button
                variant="ghost"
                className="relative "
                aria-label="Notifications"
                onClick={() => navigate('/notifications')}
            >
                <Bell
                    fill={unreadCount > 0 ? 'black' : undefined}
                    className="h-4 w-4"
                />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2em] flex items-center justify-center border border-white shadow">
                        {unreadCount}
                    </span>
                )}
            </Button>

            <ThemeToggleButton />
        </header>
    );
}

export default AppHeader;
