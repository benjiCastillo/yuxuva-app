import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './routes/auth.routes'
import { adminRoutes } from './routes/admin.routes'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  ...authRoutes,
  ...adminRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
