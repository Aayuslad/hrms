import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';

export function CollapsibleNavGroup({
    title,
    items,
}: {
    title?: string;
    items: {
        title: string;
        url: string;
        icon: LucideIcon;
        isActive?: boolean;
        roles?: string[];
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    return (
        <SidebarGroup className="-mt-5">
            {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
            <SidebarMenu className="font-semibold">
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <NavLink to={subItem.url}>
                                                {({ isActive }) => (
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className={`${isActive ? 'bg-accent' : ''}`}
                                                    >
                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                    </SidebarMenuSubButton>
                                                )}
                                            </NavLink>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
