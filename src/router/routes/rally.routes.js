import RalliesPage from '@/modules/rally/pages/RalliesPage.vue'

export const rallyRoutes = [
    {
        path: '/rallies',
        name: 'rallies',
        component: RalliesPage,
        meta: {
            breadcrumb: 'Rallies',
        },
    },
]
