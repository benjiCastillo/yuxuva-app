import RallyStageSchedulesPage from '@/modules/rally-stage-schedule/pages/RallyStageSchedulesPage.vue'

export const rallyStageScheduleRoutes = [
    {
        path: '/rally-stage-schedules',
        name: 'rally-stage-schedules',
        component: RallyStageSchedulesPage,
        meta: {
            breadcrumb: 'Programacion de Etapas',
        },
    },
]
