import ChampionshipCalendarsPage from '@/modules/championship-calendar/pages/ChampionshipCalendarsPage.vue'

export const championshipCalendarRoutes = [
    {
        path: '/championship-calendars',
        name: 'championship-calendars',
        component: ChampionshipCalendarsPage,
        meta: {
            breadcrumb: 'Calendario de Campeonatos',
        },
    },
]
