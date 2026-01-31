import { defineStore } from 'pinia'
import http from '@/services/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
  }),
  actions: {
    setSession({ accessToken, user }) {
      if (accessToken !== undefined) {
        this.accessToken = accessToken
      }
      if (user !== undefined) {
        this.user = user
      }
    },
    clearSession() {
      this.accessToken = null
      this.user = null
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
