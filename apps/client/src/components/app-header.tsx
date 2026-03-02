import { useGetNotificationns } from '@/api/user-api';
import { useAppStore } from '@/store';
import { Separator } from '@radix-ui/react-separator';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';
import { ThemeToggleButton } from './ui/theme-toggle-button';
import { useBreadCrumbs } from '@/hooks/use-bread-crumbs';

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
        <header className="flex h-13 shrink-0 items-center gap-2 border-b border-dashed w-full sticky top-0 backdrop-blur-md z-1 ">
            <div className="flex items-center gap-2 px-3 w-full ">
                <SidebarTrigger
                    className="hover:cursor-pointer"
                    onClick={() => toggleSidebar()}
                />

                <Separator orientation="vertical" className="mr-2 h-4" />

                <Breadcrumb>
                    <BreadcrumbList>
                        {/* @ts-ignore */}
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
                className="relative"
                aria-label="Notifications"
                onClick={() => navigate('/notifications')}
            >
                <Bell
                    fill={unreadCount > 0 ? 'black' : undefined}
                    className="h-4 w-4"
                />

                {unreadCount > 0 && (
                    <span className="absolute top-0 right-1 bg-fuchsia-500 text-white text-[10px] rounded-full w-4 h-4 pt-0.5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </Button>

            <ThemeToggleButton />
        </header>
    );
}

export default AppHeader;
