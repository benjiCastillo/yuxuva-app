import AuthLayout from '../../layouts/AuthLayout.vue'
import LoginPage from '../../modules/auth/pages/LoginPage.vue'

export const authRoutes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginPage,
      },
    ],
  },
]
