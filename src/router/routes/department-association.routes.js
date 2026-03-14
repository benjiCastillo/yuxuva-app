import DepartmentAssociationsPage from '@/modules/department-association/pages/DepartmentAssociationsPage.vue'

export const departmentAssociationRoutes = [
    {
        path: '/department-associations',
        name: 'department-associations',
        component: DepartmentAssociationsPage,
        meta: {
            breadcrumb: 'Asociaciones Departamentales',
        },
    },
]
