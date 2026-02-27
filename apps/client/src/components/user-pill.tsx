import { useGetMe, type UserSummary } from '@/api/user-api';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserProfileDialog } from './auth/user-profile-dialog';

export function UserPill({ user }: { user: UserSummary }) {
    const { data: me } = useGetMe();

    return (
        <UserProfileDialog userId={user.id!}>
            <div
                key={user.id}
                className="bg-muted w-fit px-2 pr-2.5 py-1.5 rounded-2xl text-sm"
            >
                <div className="flex items-center gap-1.5">
                    <Avatar className="border h-6 w-6">
                        <AvatarImage
                            src={user?.profile?.avatarUrl}
                            alt="@shadcn"
                            className="grayscale"
                        />
                        <AvatarFallback>
                            {user?.userName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="text-sx">
                            {user?.profile?.firstName} {user?.profile?.lastName}{' '}
                            {user?.id === me?.id && '(you)'}
                        </h4>
                    </div>
                </div>
            </div>
        </UserProfileDialog>
    );
}
