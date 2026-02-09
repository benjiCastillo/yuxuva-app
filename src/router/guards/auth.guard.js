import { useAuthStore } from '@/store/auth.store'

const DEFAULT_AUTH_REDIRECT = '/admin'
const LOGIN_PATH = '/login'

const isProtectedRoute = (to) => to.matched.some((record) => record.meta?.requiresAuth)

const resolveRedirectTarget = (to) => {
  const redirect = to.query?.redirect
  if (typeof redirect === 'string' && redirect.trim().length > 0) {
    return redirect
  }
  return DEFAULT_AUTH_REDIRECT
}

export const registerAuthGuard = (router) => {
  router.beforeEach((to) => {
    const authStore = useAuthStore()
    const isAuthenticated = Boolean(authStore.accessToken)

    if (to.path === LOGIN_PATH && isAuthenticated) {
      return { path: resolveRedirectTarget(to) }
    }

    if (!isProtectedRoute(to)) {
      return true
    }

    if (isAuthenticated) {
      return true
    }

    return {
      path: LOGIN_PATH,
      query: { redirect: to.fullPath },
    }
  })
}
