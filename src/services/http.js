import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { showToast } from '@/services/toast'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

http.interceptors.request.use((config) => {
    const authStore = useAuthStore()

    if (authStore.accessToken) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    return config
})

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const authStore = useAuthStore()
        const originalRequest = error.config

        if (error.response?.status === 429) {
            const message =
                error.response?.data?.message ?? 'Demasiadas solicitudes. Espera unos segundos e intenta de nuevo.'

            showToast({
                severity: 'warn',
                summary: 'Límite de solicitudes',
                detail: message,
                life: 5000,
            })
        }

        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true

            try {
                const refreshResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, null, {
                    withCredentials: true,
                })

                const { accessToken, user } = refreshResponse.data ?? {}

                if (accessToken) {
                    authStore.setSession({ accessToken, user: user ?? authStore.user })
                    originalRequest.headers = originalRequest.headers ?? {}
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    return http(originalRequest)
                }
            } catch (refreshError) {
                authStore.clearSession()
            }
        }

        return Promise.reject(error)
    }
)

export default http
