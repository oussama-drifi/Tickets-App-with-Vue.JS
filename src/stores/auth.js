import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token'))
    const isLoading = ref(false)
    const error = ref(null)

    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const role = computed(() => user.value?.role || null)

    async function login(email, password) {
        isLoading.value = true
        error.value = null
        try {
            const data = await authApi.post('/login', { email, password })
            token.value = data.token
            user.value = data.user
            localStorage.setItem('token', data.token)
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function fetchUser() {
        if (!token.value) return false
        try {
            const data = await authApi.get('/me')
            user.value = data.user
            return true
        } catch {
            token.value = null
            user.value = null
            localStorage.removeItem('token')
            return false
        }
    }

    function logout(router) {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        router.push({ name: 'login' })
    }

    return { user, token, isLoading, error, isAuthenticated, role, login, fetchUser, logout }
})