import {
    Briefcase,
    Gamepad2,
    Home,
    Plane,
    SlidersHorizontal,
    Users
} from 'lucide-react';

export const sidebarNavConfig = {
    navigration: [
        {
            name: 'Home',
            url: '/home',
            icon: Home,
        },
        {
            name: 'Games',
            url: '/games',
            icon: Gamepad2,
            roles: ['Admin', 'Recruiter', 'Viewer'],
        },
        {
            name: 'Travel Plans',
            url: '/travel-plans',
            icon: Plane,
            roles: ['Admin', 'Recruiter', 'Viewer'],
        },
        {
            name: 'Job Openings',
            url: '/job-openings',
            icon: Briefcase,
            roles: ['Admin', 'Recruiter', 'Viewer'],
        },
        {
            name: 'Org Chart',
            url: '/org-chart',
            icon: Users,
            roles: ['Admin', 'Recruiter', 'Viewer'],
        },
    ],
    collapsibleGroup: [
        {
            title: 'Configurations',
            url: 'configuration',
            icon: SlidersHorizontal,
            isActive: false,
            roles: ['Admin', 'Recruiter', 'Viewer'],
            items: [
                {
                    title: 'Roles',
                    url: 'configuration/roles',
                },
                {
                    title: 'Employees',
                    url: 'configuration/employees',
                },
                {
                    title: 'Designations',
                    url: 'configuration/designations',
                },
                {
                    title: 'Departments',
                    url: 'configuration/departments',
                },
                {
                    title: 'Document Types',
                    url: 'configuration/document-types',
                },
                {
                    title: 'Expense Catrgories',
                    url: 'configuration/expense-categories',
                },
            ],
        },
    ],
};
