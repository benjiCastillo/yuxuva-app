import CarsPage from '@/modules/car/pages/CarsPage.vue'

export const carRoutes = [
    {
        path: '/cars',
        name: 'cars',
        component: CarsPage,
        meta: {
            breadcrumb: 'Autos',
        },
    },
]
