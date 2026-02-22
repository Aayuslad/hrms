import { CreateTagDialog } from '@/components/configurations/tags/create-tag-dialog';
import { TagsTable } from '@/components/configurations/tags/tags-table';
import { Outlet } from 'react-router';

export function TagPage() {
    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Tags</h1>
                    <p>
                        Manage tags for posts and engagement content.
                    </p>
                </div>
                <div className="w-[230px] mb-4">
                    <CreateTagDialog visibleTo={['Admin', 'HR']} />
                </div>
            </div>

            <div className="w-full flex justify-evenly pt-10">
                <div className="w-full flex flex-col items-center">
                    <div className="mr-12 w-fit">
                        <TagsTable />
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
