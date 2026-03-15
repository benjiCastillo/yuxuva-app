import AdminLayout from '@/layouts/AdminLayout.vue'
import DashboardPage from '@/modules/admin/pages/DashboardPage.vue'
import ProfilePage from '@/modules/admin/pages/ProfilePage.vue'
import UsersPage from '@/modules/admin/pages/UsersPage.vue'

import { categoryRoutes } from './category.routes'
import { championshipCalendarRoutes } from './championship-calendar.routes'
import { championshipRoutes } from './championship.routes'
import { departmentAssociationRoutes } from './department-association.routes'

export const adminRoutes = [
    {
        path: '/',
        component: AdminLayout,
        meta: {
            requiresAuth: true,
            breadcrumb: 'Admin',
        },
        children: [
            {
                path: '',
                redirect: '/dashboard',
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardPage,
                meta: {
                    breadcrumb: 'Dashboard',
                },
            },
            {
                path: 'users',
                name: 'users',
                component: UsersPage,
                meta: {
                    breadcrumb: 'Users',
                },
            },
            {
                path: 'profile',
                name: 'profile',
                component: ProfilePage,
                meta: {
                    breadcrumb: 'Perfil',
                },
            },
            ...categoryRoutes,
            ...championshipCalendarRoutes,
            ...championshipRoutes,
            ...departmentAssociationRoutes,
        ],
    },
]
