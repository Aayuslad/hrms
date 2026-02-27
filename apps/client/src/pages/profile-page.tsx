import { useGetMe } from '@/api/user-api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { UpdateProfileDialog } from '@/components/auth/update-profile-dialog';
import {
    Award,
    Building,
    Calendar,
    Phone,
    Transgender,
    User,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrgChartSection } from '@/components/orgChart/org-chart-section';

export function ProfilePage() {
    const { data: user, isLoading } = useGetMe();

    if (isLoading) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <p className="text-muted-foreground">User not found</p>
            </div>
        );
    }

    const profile = user.profile;
    const roles = user.roles || [];
    const interests = user.interestedInGames || [];

    const profileContent = (
        <div className="space-y-5">
            {/* Header Section */}
            <div className="">
                <div className="pt-8 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Avatar className="size-24 shadow-md border-4 border-zinc-700">
                                <AvatarImage
                                    src={profile?.avatarUrl}
                                    alt={`${profile?.firstName} ${profile?.lastName}`}
                                />
                                <AvatarFallback className="text-2xl font-semibold ">
                                    {profile?.firstName?.[0]}
                                    {profile?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-3xl font-bold ">
                                    {profile?.firstName} {profile?.middleName}{' '}
                                    {profile?.lastName}
                                </h1>
                                <p className=" mt-1">{user.email}</p>
                                <p className="text-sm ">@{user.userName}</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <UpdateProfileDialog user={user} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="w-[800px] mx-auto mb-12">
                <div className="mb-4">
                    <h2 className="border-b text-xl">Personal Information</h2>
                </div>
                <div className="px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                        <div>
                            <User className="w-7 h-7" />
                        </div>
                        <div className="s">
                            <span className="text-sm font-semibold ">
                                Full name
                            </span>
                            <p>
                                {profile?.firstName} {profile?.middleName || ''}{' '}
                                {profile?.lastName || ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div>
                            <Phone className="h-7 w-7" />
                        </div>
                        <div>
                            <span className="text-sm font-semibold ">
                                Contact Number
                            </span>
                            <p>{profile?.contactNumber || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div>
                            <Calendar className="h-7 w-7" />
                        </div>
                        <div>
                            <span className="text-sm font-semibold ">
                                Date of Birth
                            </span>
                            <p>
                                {profile?.dateOfBirth
                                    ? new Date(
                                          profile.dateOfBirth
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div>
                            <Transgender className="h-7 w-7" />
                        </div>
                        <div>
                            <span className="text-sm font-semibold ">
                                Gender
                            </span>
                            <p>{profile?.gender || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Work Information */}
            <div className="w-[800px] mx-auto mb-12">
                <div className="mb-4">
                    <h2 className="border-b text-xl">Work Information</h2>
                </div>
                <div>
                    <div className="px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <div>
                                <Building className="h-7 w-7" />
                            </div>
                            <div>
                                <span className="text-sm font-semibold ">
                                    Department
                                </span>
                                <p>{profile?.department?.name || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div>
                                <Award className="h-7 w-7" />
                            </div>
                            <div>
                                <span className="text-sm font-semibold ">
                                    Designation
                                </span>
                                <p>{profile?.designation?.name || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div>
                                <Calendar className="h-7 w-7" />
                            </div>
                            <div>
                                <span className="text-sm font-semibold ">
                                    Joining Date
                                </span>
                                <p>
                                    {profile?.joiningDate
                                        ? new Date(
                                              profile.joiningDate
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {profile?.manager && (
                            <div>
                                <span className="text-sm font-semibold ">
                                    Manager
                                </span>
                                <div className="flex items-center space-x-3 mt-2">
                                    <Avatar className="size-10 border-2 ">
                                        <AvatarImage
                                            src={
                                                profile.manager?.profile
                                                    ?.avatarUrl
                                            }
                                            alt={`${profile.manager?.profile?.firstName} ${profile.manager.profile?.lastName}`}
                                        />
                                        <AvatarFallback className="text-sm font-semibold  ">
                                            {
                                                profile.manager?.profile
                                                    ?.firstName?.[0]
                                            }
                                            {
                                                profile.manager?.profile
                                                    ?.lastName?.[0]
                                            }
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium ">
                                            {
                                                profile.manager?.profile
                                                    ?.firstName
                                            }{' '}
                                            {profile.manager?.profile?.lastName}
                                        </p>
                                        <p className="text-xs ">
                                            {profile.manager.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Roles */}
            {roles.length > 0 && (
                <div className="w-[800px] mx-auto mb-12">
                    <div className="mb-4">
                        <h2 className="border-b text-xl">Roles</h2>
                    </div>
                    <div className=" rounded-b-xl">
                        <div className="flex flex-wrap gap-3">
                            {roles.map((role) => (
                                <Badge
                                    key={role.id}
                                    variant="outline"
                                    className="text-base"
                                >
                                    {role.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Game Interests */}
            {interests.length > 0 && (
                <div className="w-[800px] mx-auto mb-12">
                    <div className="mb-4">
                        <h2 className="border-b text-xl">Game Interests</h2>
                    </div>
                    <div className=" rounded-b-xl">
                        <div className="flex flex-wrap gap-3">
                            {interests.map((interest) => (
                                <Badge
                                    key={interest.id}
                                    variant="outline"
                                    className="text-base"
                                >
                                    {interest.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto py-5 px-4 max-w-4xl">
            <Tabs defaultValue="profile" className="gap-4 min-h-[80vh]">
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

                <TabsContent value="profile">{profileContent}</TabsContent>
                <TabsContent
                    value="orgchart"
                    className=" h-full flex items-center justify-center"
                >
                    <OrgChartSection userId={user.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
