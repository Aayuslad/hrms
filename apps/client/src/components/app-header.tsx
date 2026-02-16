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
import { useBreadCrumbs } from '@/hooks/use-bread-crumbs';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

function AppHeader() {
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
                            <BreadcrumbItem key={index}>
                                {index !== breadcrumbs.length - 1 ? (
                                    <BreadcrumbLink
                                        className="hover:cursor-pointer"
                                        onClick={() => navigate(bc.path)}
                                    >
                                        {bc.label}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{bc.label}</BreadcrumbPage>
                                )}

                                {index !== breadcrumbs.length - 1 && (
                                    <BreadcrumbSeparator className="hidden -mb-1 -mr-1 md:block" />
                                )}
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <ThemeToggleButton />
        </header>
    );
}

export default AppHeader;
