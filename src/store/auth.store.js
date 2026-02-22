import { defineStore } from 'pinia'
import http from '@/services/http'

const STORAGE_KEY = 'auth.session'

const loadSession = () => {
    if (typeof window === 'undefined') {
        return { accessToken: null, user: null }
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) {
            return { accessToken: null, user: null }
        }
        const parsed = JSON.parse(raw)
        return {
            accessToken: parsed?.accessToken ?? null,
            user: parsed?.user ?? null,
        }
    } catch (error) {
        return { accessToken: null, user: null }
    }
}

const persistSession = (session) => {
    if (typeof window === 'undefined') {
        return
    }

    if (!session?.accessToken) {
        window.localStorage.removeItem(STORAGE_KEY)
        return
    }

    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            accessToken: session.accessToken,
            user: session.user ?? null,
        })
    )
}

export const useAuthStore = defineStore('auth', {
    state: () => loadSession(),
    actions: {
        setSession({ accessToken, user }) {
            if (accessToken !== undefined) {
                this.accessToken = accessToken
            }
            if (user !== undefined) {
                this.user = user
            }

            persistSession({ accessToken: this.accessToken, user: this.user })
        },
        clearSession() {
            this.accessToken = null
            this.user = null
            persistSession({ accessToken: null, user: null })
        },
        async login(payload) {
            const { data } = await http.post('/auth/login', payload)
            const { accessToken, user } = data ?? {}

            if (accessToken) {
                this.setSession({ accessToken, user })
            }

            return data
        },
        async logout() {
            try {
                await http.post('/auth/logout')
            } finally {
                this.clearSession()
            }
        },
    },
})
