import { useGetUserById } from '@/api/user-api';
import { OrgChartSection } from '@/components/orgChart/org-chart-section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Award,
    Building,
    Calendar,
    Phone,
    Transgender,
    UserRoundCog,
} from 'lucide-react';
import { useState } from 'react';

type Props = {
    userId: string;
    children: React.ReactNode;
};

export function UserProfileDialog({ userId, children }: Props) {
    const { data: user, isLoading } = useGetUserById(userId);
    const [open, setOpen] = useState(false);

    if (!userId) return <>{children}</>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer">{children}</div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[75vh]">
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <Spinner className="size-6" />
                        </div>
                    )}

                    {user && (
                        <Tabs defaultValue="profile" className="gap-4 h-[75vh]">
                            <TabsList className="bg-background rounded-none border-b w-full p-0">
                                <TabsTrigger
                                    value="profile"
                                    className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
                                >
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger
                                    value="orgchart"
                                    className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
                                >
                                    Org Chart
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="size-16">
                                            <AvatarImage
                                                src={user.profile?.avatarUrl}
                                                alt={`${user.profile?.firstName} ${user.profile?.lastName}`}
                                            />
                                            <AvatarFallback>
                                                {user.profile?.firstName?.[0]}
                                                {user.profile?.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {user.profile?.firstName}{' '}
                                                {user.profile?.middleName}{' '}
                                                {user.profile?.lastName}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                @{user.userName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Personal Information */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium border-b">
                                            Personal Information
                                        </h4>
                                        <div className="grid grid-cols-2 mx-8 gap-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <Phone className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground font-semibold text-sm">
                                                        Contact
                                                    </span>
                                                    <p>
                                                        {user.profile
                                                            ?.contactNumber ||
                                                            'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <Transgender className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground font-semibold text-sm">
                                                        Gender
                                                    </span>
                                                    <p>
                                                        {user.profile?.gender ||
                                                            'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <Calendar className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground font-semibold text-sm">
                                                        DOB
                                                    </span>
                                                    <p>
                                                        {user.profile
                                                            ?.dateOfBirth
                                                            ? new Date(
                                                                  user.profile
                                                                      .dateOfBirth
                                                              ).toLocaleDateString()
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <Calendar className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground font-semibold text-sm">
                                                        Joined On
                                                    </span>
                                                    <p>
                                                        {user.profile
                                                            ?.joiningDate
                                                            ? new Date(
                                                                  user.profile
                                                                      .joiningDate
                                                              ).toLocaleDateString()
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Work Information */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium border-b">
                                            Work Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm mx-8">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <Building className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground font-semibold text-sm">
                                                            Department
                                                        </span>
                                                        <p>
                                                            {user.profile
                                                                ?.department
                                                                ?.name || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <Award className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground font-semibold text-sm">
                                                        Designation
                                                    </span>
                                                    <p>
                                                        {user.profile
                                                            ?.designation
                                                            ?.name || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {user.profile?.manager && (
                                            <div className="flex items-center gap-3 mt-4 mx-8">
                                                <div>
                                                    <UserRoundCog className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground font-semibold text-sm">
                                                        Manager
                                                    </span>
                                                    <UserProfileDialog
                                                        userId={
                                                            user.profile.manager
                                                                .id!
                                                        }
                                                    >
                                                        <span className="underline cursor-pointer">
                                                            {
                                                                user.profile
                                                                    .manager
                                                                    .userName
                                                            }
                                                        </span>
                                                    </UserProfileDialog>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Roles */}
                                    {user.roles && user.roles.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-medium border-b">
                                                Roles
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Game Interests */}
                                    {user.interestedInGames &&
                                        user.interestedInGames.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="font-medium border-b">
                                                    Game Interests
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {user.interestedInGames.map(
                                                        (game) => (
                                                            <Badge
                                                                key={game.id}
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {game.name}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </TabsContent>
                            <TabsContent value="orgchart" className="flex  items-center justify-center">
                                <OrgChartSection userId={user.id} />
                            </TabsContent>
                        </Tabs>
                    )}

                    {user === null && (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground">
                                User not found
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
