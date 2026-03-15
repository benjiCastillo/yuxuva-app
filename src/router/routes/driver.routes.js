import DriversPage from '@/modules/driver/pages/DriversPage.vue'

export const driverRoutes = [
    {
        path: '/drivers',
        name: 'drivers',
        component: DriversPage,
        meta: {
            breadcrumb: 'Pilotos',
        },
    },
]
