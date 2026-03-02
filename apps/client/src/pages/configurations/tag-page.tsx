import { CreateTagDialog } from '@/components/configurations/tags/create-tag-dialog';
import { TagsTable } from '@/components/configurations/tags/tags-table';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { UpdateTagDialog } from '@/components/configurations/tags/update-tag-dialog';
import { DeleteTagDialog } from '@/components/configurations/tags/delete-tag-dialog';

export function TagPage() {
    const { openConfigDialog } = useAppStore(
        useShallow((s) => ({
            openConfigDialog: s.openConfigDialog,
        }))
    );

    return (
        <div className=" h-full">
            <div className="bg-muted  h-[100px] w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Tags</h1>
                    <p>Categorize and organize achievement and social posts.</p>
                </div>
                <div className="w-[180px] mb-4">
                    <Button variant="secondary" className="border" onClick={() => openConfigDialog({ entity: 'tags', mode: 'create' })}>
                        + Create Tag
                    </Button>
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

            <CreateTagDialog visibleTo={['Admin', 'HR']} />
            <UpdateTagDialog />
            <DeleteTagDialog />
        </div>
    );
}
