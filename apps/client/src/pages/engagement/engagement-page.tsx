import { useGetPosts } from '@/api/engagement-api';
import { CreatePostDialog } from '@/components/engagement/dialogs/create-post-dialog';
import { PostsList } from '@/components/engagement/posts-list';
import { Spinner } from '@/components/ui/spinner';
import { Outlet } from 'react-router';

export function EngagementPage() {
    const { isLoading, isError } = useGetPosts();

    if (isLoading) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                Error fetching data...!
            </div>
        );
    }

    return (
        <div className=" h-full relative">
            <div className="w-fit absolute top-7 right-7 ml-auto z-10 pt-4">
                <CreatePostDialog />
            </div>

            <div className="w-full flex justify-evenly pt-10">
                <div className="w-full flex flex-col items-center">
                    <div className="mr-30 w-fit mb-10">
                        <PostsList />
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
