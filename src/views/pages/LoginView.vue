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
const showPassword = ref(false)

function loginWithGoogle() {
    // TODO: implement Google OAuth
    console.log('Google login')
}

function loginWithMicrosoft() {
    // TODO: implement Microsoft OAuth
    console.log('Microsoft login')
}

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
            <img src="/logoDark.png" alt="Logo" class="login-logo logo-dark" />
            <img src="/logoLight.png" alt="Logo" class="login-logo logo-light" />
            <h1>Sign in</h1>
            <p class="subtitle">Sign in to your account</p>

            <div class="social-buttons">
                <button type="button" class="social-btn" @click="loginWithGoogle">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>
                <button type="button" class="social-btn" @click="loginWithMicrosoft">
                    <svg viewBox="0 0 21 21" width="18" height="18">
                        <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                        <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                        <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                        <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                    </svg>
                    Continue with Microsoft
                </button>
            </div>

            <div class="divider">
                <span>or</span>
            </div>

            <form @submit.prevent="handleLogin">
                <div class="field" :class="{ active: email }">
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        placeholder=" "
                        required
                        autocomplete="email"
                    />
                    <label for="email"><i class="bi bi-envelope"></i> Email</label>
                </div>

                <div class="field" :class="{ active: password }">
                    <input
                        id="password"
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder=" "
                        required
                        autocomplete="current-password"
                    />
                    <label for="password"><i class="bi bi-key"></i> Password</label>
                    <i
                        class="bi toggle-password"
                        :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                        @click="showPassword = !showPassword"
                    ></i>
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
    border: 2px solid var(--border, #e0e0e0);
    border-radius: 14px;
    padding: 30px;
    width: 100%;
    max-width: 400px;
}

.login-logo {
    height: 40px;
    width: auto;
    margin-bottom: 20px;
}

.logo-dark {
    display: block;
}

.logo-light {
    display: none;
}

[data-theme="dark"] .logo-dark {
    display: none;
}

[data-theme="dark"] .logo-light {
    display: block;
}

.login-card h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text, #1a1a1a);
}

.subtitle {
    color: var(--text-muted, #888);
    font-size: 14px;
    margin-bottom: 28px;
}

.social-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border, #e0e0e0);
    border-radius: 8px;
    background: var(--surface, #fff);
    color: var(--text, #1a1a1a);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
}

.social-btn:hover {
    transition-duration: 0.3s;
    border-color: var(--primary, #888);
    background-color: var(--primary-bg-color);
}

.divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    color: var(--text-muted, #888);
    font-size: 13px;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border, #e0e0e0);
}

.field {
    position: relative;
    margin-bottom: 18px;
}

.field label {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: var(--text-muted, #888);
    pointer-events: none;
    transition: all 0.2s ease;
    padding: 0;
}

.toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--text-muted, #888);
    font-size: 16px;
}

.toggle-password:hover {
    color: var(--text, #1a1a1a);
}

.field input {
    width: 100%;
    padding: 20px 36px 8px 12px;
    border: 1px solid var(--border, #e0e0e0);
    border-radius: 8px;
    font-size: 14px;
    background: var(--bg, #f5f5f5);
    color: var(--text, #1a1a1a);
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.field input:focus {
    border-color: var(--primary, #4f46e5);
}

.field input:focus + label,
.field.active label,
.field input:not(:placeholder-shown) + label {
    top: 8px;
    transform: translateY(0);
    font-size: 10px;
    color: var(--primary, #4f46e5);
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