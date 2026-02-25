type RouteConfigType = {
    path: string;
    breadcrumb: string | ((params: string) => string);
    children?: RouteConfigType[];
};

export const routes: RouteConfigType[] = [
    {
        breadcrumb: 'Home',
        path: 'home',
    },
    {
        breadcrumb: 'Job Openings',
        path: 'job-openings',
        children: [
            {
                breadcrumb: 'Opening',
                path: ':id',
            },
        ],
    },
    {
        breadcrumb: 'Games',
        path: 'games',
        children: [
            {
                breadcrumb: 'Game',
                path: ':id',
            },
        ],
    },
    {
        breadcrumb: 'Travel Plans',
        path: 'travel-plans',
        children: [
            {
                breadcrumb: 'Travel Plan',
                path: ':id',
            },
        ],
    },
    {
        breadcrumb: 'Org Chart',
        path: 'org-chart',
    },
    {
        breadcrumb: 'Achievements & Social',
        path: 'engagement',
    },
    {
        breadcrumb: 'Configurations',
        path: 'configuration',
        children: [
            // {
            //     breadcrumb: 'Roles',
            //     path: 'roles',
            // },
            {
                breadcrumb: 'Employees',
                path: 'employees',
            },
            {
                breadcrumb: 'Designations',
                path: 'designations',
            },
            {
                breadcrumb: 'Departments',
                path: 'departments',
            },
            {
                breadcrumb: 'Expense Catrgories',
                path: 'expense-categories',
            },
            {
                breadcrumb: 'Document Types',
                path: 'document-types',
            },
            {
                breadcrumb: 'Expense Catrgories',
                path: 'expense-categories',
            },
            {
                breadcrumb: 'Tags',
                path: 'tags',
            },
        ],
    },
    {
        breadcrumb: 'User Profile',
        path: 'user-profile',
    },
    {
        breadcrumb: 'Notifications',
        path: 'notifications',
    },
];
