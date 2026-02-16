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
    },
    {
        breadcrumb: 'Games',
        path: 'games',
    },
    {
        breadcrumb: 'Travel Plans',
        path: 'travel-plans',
    },
    {
        breadcrumb: 'Org Chart',
        path: 'org-chart',
    },
    {
        breadcrumb: 'Configurations',
        path: 'configuration',
        children: [
            {
                breadcrumb: 'Roles',
                path: 'roles',
            },
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
