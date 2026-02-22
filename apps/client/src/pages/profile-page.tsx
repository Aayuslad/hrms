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
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="space-y-8">
                {/* Header Section */}
                <Card className="shadow-lg rounded-2xl bg-linear-to-br  border-none">
                    <CardContent className="pt-8 pb-6">
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
                                <p className=" mt-1">
                                    {user.email}
                                </p>
                                <p className="text-sm ">
                                    @{user.userName}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="shadow-md rounded-xl">
                    <CardHeader className=" rounded-t-xl">
                        <CardTitle className="">
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4  rounded-b-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="text-xs font-semibold ">
                                    First Name
                                </span>
                                <p className="text-base mt-1">
                                    {profile?.firstName || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold ">
                                    Middle Name
                                </span>
                                <p className="text-base  mt-1">
                                    {profile?.middleName || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold ">
                                    Last Name
                                </span>
                                <p className="text-base  mt-1">
                                    {profile?.lastName || 'N/A'}
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
                    </CardContent>
                </Card>

                {/* Work Information */}
                <Card className="shadow-md rounded-xl">
                    <CardHeader className=" rounded-t-xl">
                        <CardTitle className="">
                            Work Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4  rounded-b-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>

                        {profile?.manager && (
                            <>
                                <Separator className="my-4 " />
                                <div>
                                    <span className="text-xs font-semibold ">
                                        Manager
                                    </span>
                                    <div className="flex items-center space-x-3 mt-2">
                                        <Avatar className="size-10 border-2 ">
                                            <AvatarImage
                                                src={profile.manager.avatarUrl}
                                                alt={`${profile.manager.firstName} ${profile.manager.lastName}`}
                                            />
                                            <AvatarFallback className="text-sm font-semibold  ">
                                                {profile.manager.firstName?.[0]}
                                                {profile.manager.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-base font-medium ">
                                                {profile.manager.firstName}{' '}
                                                {profile.manager.lastName}
                                            </p>
                                            <p className="text-xs ">
                                                {profile.manager.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Roles */}
                {roles.length > 0 && (
                    <Card className="shadow-md rounded-xl">
                        <CardHeader className=" rounded-t-xl">
                            <CardTitle className="">
                                Roles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className=" rounded-b-xl">
                            <div className="flex flex-wrap gap-3">
                                {roles.map((role) => (
                                    <Badge
                                        key={role.id}
                                        variant="secondary"
                                        className="px-4 py-2 text-base rounded-lg"
                                    >
                                        {role.name}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Game Interests */}
                {interests.length > 0 && (
                    <Card className="shadow-md rounded-xl">
                        <CardHeader className=" rounded-t-xl">
                            <CardTitle className="">
                                Game Interests
                            </CardTitle>
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
