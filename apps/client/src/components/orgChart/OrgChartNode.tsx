import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useGetUserList } from '@/api/user-api';
import { UserProfileDialog } from '../auth/user-profile-dialog';
import { useEffect, useState } from 'react';

interface OrgChartNodeProps {
    node: {
        name: string;
        title: string;
        department: string | null;
        avatarUrl: string | null;
    };
}

export function OrgChartNode({ node }: OrgChartNodeProps) {
    const { data: users } = useGetUserList();
    const [userId, setUserId] = useState<string>();

    useEffect(() => {
        if (users) {
            const userId = users.find(
                (x) =>
                    node.name ==
                    `${x?.profile?.firstName} ${x.profile?.lastName}`
            )?.id;
            userId && setUserId(userId);
        }
    }, [users]);

    return (
        <Card className="w- p-0 py-0.5 shadow-lg  hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-1 px-4 flex flex-col items-center  space-y-1">
                <UserProfileDialog userId={userId as string}>
                    <div className="flex gap-2">
                        <Avatar className="w-8 h-8 border-2 border-primary/30">
                            <AvatarImage src={node.avatarUrl || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font">
                                {node.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0">
                            <h3 className="font-bold text-sm text-foreground">
                                {node.name}
                            </h3>
                            <p className="text-xs font-medium text-primary">
                                {node.title}
                            </p>
                        </div>
                    </div>
                    {node.department && (
                        <p className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            {node.department}
                        </p>
                    )}
                </UserProfileDialog>
            </CardContent>
        </Card>
    );
}
