import TeamsPage from '@/modules/team/pages/TeamsPage.vue'

export const teamRoutes = [
    {
        path: '/teams',
        name: 'teams',
        component: TeamsPage,
        meta: {
            breadcrumb: 'Equipos',
        },
    },
]
