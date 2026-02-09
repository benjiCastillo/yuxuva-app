import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './routes/auth.routes'
import { adminRoutes } from './routes/admin.routes'
import { registerAuthGuard } from './guards/auth.guard'

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

registerAuthGuard(router)

export default router
