import type { OrgChartNodeType } from '@/api/user-api';
import { useGetOrgCharts } from '@/api/user-api';

import { CustomOrgChart } from '@/components/orgChart/CustomOrgChart';

interface ChartNode {
    name: string;
    title: string;
    department: string | null;
    avatarUrl: string | null;
    children: ChartNode[];
}

function transformUser(user: OrgChartNodeType): ChartNode {
    return {
        name: `${user.firstName} ${user.lastName}`,
        title: user.designation || 'N/A',
        department: user?.department ?? 'N/A',
        avatarUrl: user?.avatarUrl ?? null,
        children: user?.manages?.map(transformUser) ?? [],
    };
}

export function Index() {
    const { data: orgCharts, isLoading } = useGetOrgCharts();

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                    {/* <CreateJobOpeningSheet visibleTo={['Admin', 'Recruiter']} /> */}
                </div>
            </div>

            <div className="w-full pt-10">
                {/* Custom Org Chart will be rendered here */}
                {orgCharts?.map((orgChart) => {
                    const tree = transformUser(orgChart);
                    const key = `${tree.name}-${tree.title}-${tree.department}`;
                    return (
                        <div
                            key={key}
                            className="mb-10 overflow-y-auto flex justify-center items-center"
                        >
                            <CustomOrgChart tree={tree} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
