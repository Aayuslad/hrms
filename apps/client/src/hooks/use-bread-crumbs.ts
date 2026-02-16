import { routes } from '@/config/breadcrumb-route-config';
import { matchRoutes, useLocation, useParams } from 'react-router-dom';

export function useBreadCrumbs() {
    const location = useLocation();
    const params = useParams();

    const matches = matchRoutes(routes, location);

    if (!matches) return [];

    return matches.map((match) => {
        const { route } = match;
        let label;

        if (typeof route.breadcrumb === 'function') {
            //@ts-expect-error will resolve when it is used
            label = route.breadcrumb(params);
        } else {
            label = route.breadcrumb;
        }

        return { label, path: match.pathname };
    });
}
