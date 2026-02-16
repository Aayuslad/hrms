import { useGetMe } from '@/api/user-api';
import AppHeader from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { useAppStore } from '@/store';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import LoadingPage from '../pages/loading-page';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

function HomeLayout() {
    const { isPending } = useGetMe();
    const { sidebarState } = useAppStore(
        useShallow((s) => ({
            sidebarState: s.sidebarState,
        }))
    );

    if (isPending) {
        return <LoadingPage />;
    }

    return (
        <SidebarProvider open={sidebarState === 'opened' ? true : false}>
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}

export default HomeLayout;
