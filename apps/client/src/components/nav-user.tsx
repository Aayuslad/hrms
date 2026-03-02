import { Bell, ChevronsUpDown, LogOut, User } from 'lucide-react';

import { useGetMe, useLogoutUser } from '@/api/user-api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';

export function NavUser() {
    const { isMobile } = useSidebar();
    const { data: user } = useGetMe();
    const navigate = useNavigate();
    const logoutMutation = useLogoutUser();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user?.profile?.avatarUrl}
                                    alt="Avatar"
                                />
                                <AvatarFallback className="rounded-lg capitalize">
                                    {user?.userName ? user?.userName[0] : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user?.userName}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) bg-sidebar min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user?.profile?.avatarUrl}
                                        alt="Avatar"
                                    />
                                    <AvatarFallback className="rounded-lg capitalize">
                                        {user?.userName
                                            ? user?.userName[0]
                                            : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user?.userName}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => navigate('/user-profile')}
                            >
                                <User />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/notifications')}
                            >
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <button
                            type="button"
                            className="flex w-full items-center gap-2"
                            disabled={logoutMutation.isPending}
                            onClick={() => logoutMutation.mutate()}
                        >
                            <DropdownMenuItem className="w-full">
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </button>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
