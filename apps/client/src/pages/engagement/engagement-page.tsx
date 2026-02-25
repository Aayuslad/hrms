import { CreatePostDialog } from '@/components/engagement/dialogs/create-post-dialog';
import { PostsList } from '@/components/engagement/posts-list';
import { Outlet } from 'react-router';

export function EngagementPage() {
    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">
                        Achievements & Social
                    </h1>
                    <p>
                        Connect and engage with your colleagues through posts
                        and discussions.
                    </p>
                </div>
                <div className="w-[180px] mb-4">
                    <CreatePostDialog />
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-10">
                <div className="w-full flex flex-col items-center">
                    <div className="mr-12 w-fit mb-10">
                        <PostsList />
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
