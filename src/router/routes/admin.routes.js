import AdminLayout from '../../layouts/AdminLayout.vue'
import DashboardHome from '../../modules/admin/pages/DashboardHome.vue'

export const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardHome,
      },
    ],
  },
]
