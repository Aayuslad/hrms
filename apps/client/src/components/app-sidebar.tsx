'use client';

import * as React from 'react';

import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { sidebarNavConfig as data } from '@/config/side-bar-nav-config';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { CollapsibleNavGroup } from './collapsible-nav-group';
import { SimpleNavGroup } from './simple-nav-group';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { toggleSidebar, sidebarState } = useAppStore(
        useShallow((s) => ({
            toggleSidebar: s.toggleSidebarState,
            sidebarState: s.sidebarState,
        }))
    );

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="border text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                                    <span className="text-xl font-semibold text-black dark:text-white">
                                        R
                                    </span>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        Roima Intelligence
                                    </span>
                                    <span className="truncate text-xs">
                                        India
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent
                className={` space-y-1 ${sidebarState === 'opened' ? 'px-2' : ''}`}
            >
                <SimpleNavGroup Workflows={data.navigration} />
                <CollapsibleNavGroup items={data.collapsibleGroup} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail onClick={() => toggleSidebar()} />
        </Sidebar>
    );
}
