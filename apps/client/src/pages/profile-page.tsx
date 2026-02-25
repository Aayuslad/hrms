import { useGetMe } from '@/api/user-api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

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

    return (
        <div className="container mx-auto py-5 px-4 max-w-4xl">
            <div className="space-y-5">
                {/* Header Section */}
                <div className="">
                    <div className="pt-8 pb-6">
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
                    </div>
                </div>

                {/* Personal Information */}
                <div className="w-[800px] mx-auto mb-12">
                    <div className="mb-4">
                        <h2 className="border-b text-xl">
                            Personal Information
                        </h2>
                    </div>
                    <div className="px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <span className="text-xs font-semibold ">
                                Full name
                            </span>
                            <p className="text-base mt-1">
                                {profile?.firstName} {profile?.middleName || ''}{' '}
                                {profile?.lastName || ''}
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-semibold ">
                                Contact Number
                            </span>
                            <p className="text-base  mt-1">
                                {profile?.contactNumber || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs font-semibold ">
                                Date of Birth
                            </span>
                            <p className="text-base  mt-1">
                                {profile?.dateOfBirth
                                    ? new Date(
                                          profile.dateOfBirth
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs font-semibold ">
                                Gender
                            </span>
                            <p className="text-base  mt-1">
                                {profile?.gender || 'N/A'}
                            </p>
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
                            <div>
                                <span className="text-xs font-semibold ">
                                    Department
                                </span>
                                <p className="text-base  mt-1">
                                    {profile?.department?.name || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold ">
                                    Designation
                                </span>
                                <p className="text-base  mt-1">
                                    {profile?.designation?.name || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold ">
                                    Joining Date
                                </span>
                                <p className="text-base  mt-1">
                                    {profile?.joiningDate
                                        ? new Date(
                                              profile.joiningDate
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </p>
                            </div>

                            {profile?.manager && (
                                <div>
                                    <span className="text-xs font-semibold ">
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
                                                {
                                                    profile.manager?.profile
                                                        ?.lastName
                                                }
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
                    <Card className="shadow-md rounded-xl">
                        <CardHeader className=" rounded-t-xl">
                            <CardTitle className="">Game Interests</CardTitle>
                        </CardHeader>
                        <CardContent className=" rounded-b-xl">
                            <div className="flex flex-wrap gap-3">
                                {interests.map((interest) => (
                                    <Badge
                                        key={interest.id}
                                        variant="outline"
                                        className="px-4 py-2 text-base rounded-lg  "
                                    >
                                        {interest.name}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
