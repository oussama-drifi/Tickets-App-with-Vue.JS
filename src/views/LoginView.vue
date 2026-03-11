<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

async function handleLogin() {
    error.value = null
    loading.value = true
    try {
        await authStore.login(email.value, password.value)
        if (authStore.role === 'admin') {
            router.push({ name: 'dashboard' })
        } else {
            router.push({ name: 'commercial' })
        }
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="login-page">
        <div class="login-card">
            <h1>Login</h1>
            <p class="subtitle">Sign in to your account</p>

            <form @submit.prevent="handleLogin">
                <div class="field">
                    <label for="email">Email</label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        autocomplete="email"
                    />
                </div>

                <div class="field">
                    <label for="password">Password</label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        placeholder="Your password"
                        required
                        autocomplete="current-password"
                    />
                </div>

                <div v-if="error" class="error-msg">{{ error }}</div>

                <button type="submit" :disabled="loading">
                    <span v-if="loading">Signing in...</span>
                    <span v-else>Sign in</span>
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--bg, #f5f5f5);
}

.login-card {
    background: var(--surface, #fff);
    border: 1px solid var(--border, #e0e0e0);
    border-radius: 14px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
}

.login-card h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text, #1a1a1a);
    margin-bottom: 4px;
}

.subtitle {
    color: var(--text-muted, #888);
    font-size: 14px;
    margin-bottom: 28px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
}

.field label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text, #1a1a1a);
}

.field input {
    padding: 10px 12px;
    border: 1px solid var(--border, #e0e0e0);
    border-radius: 8px;
    font-size: 14px;
    background: var(--bg, #f5f5f5);
    color: var(--text, #1a1a1a);
    outline: none;
    transition: border-color 0.2s;
}

.field input:focus {
    border-color: var(--primary, #4f46e5);
}

.error-msg {
    color: var(--danger, #e53e3e);
    font-size: 13px;
    margin-bottom: 12px;
    padding: 8px 12px;
    background: rgba(229, 62, 62, 0.08);
    border-radius: 8px;
}

button[type="submit"] {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 8px;
    background: var(--primary, #4f46e5);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

button[type="submit"]:hover:not(:disabled) {
    opacity: 0.9;
}

button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>