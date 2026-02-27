import {
    Briefcase,
    Gamepad2,
    Home,
    MessageSquare,
    Plane,
    SlidersHorizontal,
    Users,
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
            roles: ['Employee'],
        },
        {
            name: 'Travel Plans',
            url: '/travel-plans',
            icon: Plane,
            roles: ['Employee'],
        },
        {
            name: 'Job Openings',
            url: '/job-openings',
            icon: Briefcase,
            roles: ['Employee'],
        },
        {
            name: 'Achievements & Social',
            url: '/engagement',
            icon: MessageSquare,
            roles: ['Employee'],
        },
    ],
    collapsibleGroup: [
        {
            title: 'Configurations',
            url: 'configuration',
            icon: SlidersHorizontal,
            isActive: false,
            roles: ['Admin', 'HR'],
            items: [
                // {
                //     title: 'Roles',
                //     url: 'configuration/roles',
                // },
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
                {
                    title: 'Tags',
                    url: 'configuration/tags',
                },
            ],
        },
    ],
};
