import { Card, CardContent } from '@/components/ui/card';

interface OrgChartNodeProps {
    node: {
        name: string;
        title: string;
        department: string | null;
        avatarUrl: string | null;
    };
}

export function OrgChartNode({ node }: OrgChartNodeProps) {
    return (
        <Card className="w-52 p-1 shadow-lg border-2 border-primary/20 bg-white hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                {/* <Avatar className="w-16 h-16 border-2 border-primary/30">
                    <AvatarImage src={node.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {node.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                </Avatar> */}
                <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground">{node.name}</h3>
                    <p className="text-sm font-medium text-primary">{node.title}</p>
                    {node.department && (
                        <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {node.department}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}