import type { OrgChartNodeType } from '@/api/user-api';
import { useGetOrgCharts } from '@/api/user-api';
import { CustomOrgChart } from './CustomOrgChart';
import { Spinner } from '@/components/ui/spinner';

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
        title: user.designation || 'Designation not set',
        department: user?.department ?? null,
        avatarUrl: user?.avatarUrl ?? null,
        children: user?.manages?.map(transformUser) ?? [],
    };
}

type OrgChartSectionProps = {
    userId?: string;
};

export function OrgChartSection({ userId }: OrgChartSectionProps) {
    const { data: orgCharts, isLoading } = useGetOrgCharts(userId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Spinner className="size-6" />
            </div>
        );
    }

    if (!orgCharts || orgCharts.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No org chart available</p>
            </div>
        );
    }

    return (
        <>
            {orgCharts.map((orgChart) => {
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
        </>
    );
}
