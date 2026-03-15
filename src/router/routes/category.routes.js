import CategoriesPage from '@/modules/category/pages/CategoriesPage.vue'

export const categoryRoutes = [
    {
        path: '/categories',
        name: 'categories',
        component: CategoriesPage,
        meta: {
            breadcrumb: 'Categorias',
        },
    },
]
