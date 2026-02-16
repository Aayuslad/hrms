import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

type Props = {
    id: string;
    name: string;
    type?: string | null;
};

export function SkillPill({ id, name, type }: Props) {
    if (!type) {
        return (
            <Badge
                variant="outline"
                className="text-sm font-normal pb-1 px-2.5 mr-1 mb-1"
            >
                <span>{name}</span>
            </Badge>
        );
    }

    return (
        <Tooltip key={id}>
            <TooltipTrigger asChild>
                <Badge
                    variant="outline"
                    className={`${type ? (type === 'Required' ? 'border-amber-950' : 'border-cyan-800') : ''} text-sm font-normal pb-1 px-2.5 mr-1 mb-1`}
                >
                    <span>{name}</span>
                </Badge>
            </TooltipTrigger>
            <TooltipContent>
                {type && (
                    <p className="space-x-1.5 mb-1">
                        <span>{type} skill</span>
                    </p>
                )}
            </TooltipContent>
        </Tooltip>
    );
}
