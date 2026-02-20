import { useGetMe } from '@/api/user-api';
import AppHeader from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { useAppStore } from '@/store';
import { Outlet, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import LoadingPage from '../pages/loading-page';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

function HomeLayout() {
    const navigate = useNavigate();
    const { isPending, isError } = useGetMe();
    const { sidebarState } = useAppStore(
        useShallow((s) => ({
            sidebarState: s.sidebarState,
        }))
    );

    if (isPending) {
        return <LoadingPage />;
    }

    if (isError) {
        navigate('/login');
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
