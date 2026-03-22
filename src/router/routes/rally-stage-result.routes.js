import RallyStageResultsPage from '@/modules/rally-stage-result/pages/RallyStageResultsPage.vue'

export const rallyStageResultRoutes = [
    {
        path: '/rally-stage-results',
        name: 'rally-stage-results',
        component: RallyStageResultsPage,
        meta: {
            breadcrumb: 'Resultados de Etapas',
        },
    },
]
