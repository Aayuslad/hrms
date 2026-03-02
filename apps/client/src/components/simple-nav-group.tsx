import { type LucideIcon } from 'lucide-react';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';
import { useAccessChecker } from '@/hooks/use-has-access';

type Props = {
    Workflows: {
        name: string;
        url: string;
        icon: LucideIcon;
        roles?: string[];
    }[];
    title?: string;
};

export function SimpleNavGroup({ Workflows, title }: Props) {
    const canAccess = useAccessChecker();

    const accessibleWorkflows = Workflows.filter((workflow) => {
        if (!workflow.roles || workflow.roles.length === 0) {
            return false;
        }
        return canAccess(workflow.roles);
    });

    return (
        <SidebarGroup>
            {title !== null && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
            <SidebarMenu className="font-semibold space-y-1">
                {accessibleWorkflows.map((item) => (
                    <NavLink to={item.url} key={item.name}>
                        {({ isActive }) => (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip={item.name}
                                    className={isActive ? 'bg-accent' : ''}
                                >
                                    <item.icon />
                                    <span>{item.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </NavLink>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
