import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './routes/auth.routes'
import { adminRoutes } from './routes/admin.routes'
import { registerAuthGuard } from './guards/auth.guard'

const routes = [
    ...authRoutes,
    ...adminRoutes,
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

registerAuthGuard(router)

export default router
