import { useGetMe } from '@/api/user-api';
import { OrgChartSection } from '@/components/orgChart/org-chart-section';

export function Index() {
    const { data: me } = useGetMe();

    return (
        <div className="h-full">
            <div className="bg-muted h-25 w-full flex items-center">
                <div className="px-10 flex-1">
                    <h1 className="text-2xl font-bold">Organisation Chart</h1>
                    <p>
                        Visualize reporting structure and explore team
                        hierarchy.
                    </p>
                </div>
                <div className="w-57.5 mb-4">
                    {/* <CreateJobOpeningSheet visibleTo={[*/
            }
                </div>
            </div>

            <div className="w-full pt-10">
                {/* Custom Org Chart will be rendered here */}
                <OrgChartSection userId={me?.id} />
            </div>
        </div>
    );
}
