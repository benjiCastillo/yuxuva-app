import RallyStagesPage from '@/modules/rally-stage/pages/RallyStagesPage.vue'

export const rallyStageRoutes = [
    {
        path: '/rally-stages',
        name: 'rally-stages',
        component: RallyStagesPage,
        meta: {
            breadcrumb: 'Etapas de Rally',
        },
    },
]
