<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark')
const showProfile = ref(false)
const profileCardRef = ref(null)
const profileBtnRef = ref(null)

function toggleTheme() {
    isDark.value = !isDark.value
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : '')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function toggleProfile() {
    showProfile.value = !showProfile.value
}

function handleOutsideClick(e) {
    if (
        showProfile.value &&
        profileCardRef.value && !profileCardRef.value.contains(e.target) &&
        profileBtnRef.value && !profileBtnRef.value.contains(e.target)
    ) {
        showProfile.value = false
    }
}

function handleLogout() {
    showProfile.value = false
    auth.logout(router)
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
    <div class="commercial-layout">
        <nav class="navbar">
            <div class="nav-left">
                <RouterLink to="/commercial" class="nav-logo">
                    <img src="/logo.png" alt="Logo" />
                </RouterLink>
                <div class="nav-links">
                    <RouterLink :to="{ name: 'commercial-tickets' }" class="nav-item">
                        <i class="bi bi-ticket-perforated"></i>
                        <span>Tickets</span>
                    </RouterLink>
                    <RouterLink :to="{ name: 'commercial-new-ticket' }" class="nav-item">
                        <i class="bi bi-plus-circle"></i>
                        <span>New Ticket</span>
                    </RouterLink>
                </div>
            </div>

            <div class="nav-right">
                <button class="nav-btn" @click="toggleTheme">
                    <i v-if="isDark" class="bi bi-brightness-high"></i>
                    <i v-else class="bi bi-moon"></i>
                </button>
                <button ref="profileBtnRef" class="nav-btn profile-btn" :class="{ active: showProfile }" @click="toggleProfile">
                    <i class="bi bi-person-circle"></i>
                </button>
            </div>

            <!-- Profile Card -->
            <Transition name="profile-pop">
                <div v-if="showProfile" ref="profileCardRef" class="profile-card">
                    <div class="profile-card-header">
                        <div class="profile-avatar">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <div class="profile-info">
                            <span class="profile-name">{{ auth.user?.name || 'Commercial' }}</span>
                            <span class="profile-role">{{ auth.user?.email || '—' }}</span>
                        </div>
                    </div>
                    <div class="profile-card-footer">
                        <button class="logout-btn" @click="handleLogout">
                            <i class="bi bi-box-arrow-left"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </Transition>
        </nav>

        <main class="commercial-main">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
.commercial-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
}

/* ---- Navbar ---- */
.navbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 60px;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 6px;
    flex-shrink: 0;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 24px;
}

.nav-logo img {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
    background: var(--bg);
    color: var(--text);
}

.nav-item.router-link-active {
    background: var(--primary);
    color: #fff;
}

.nav-item i {
    font-size: 16px;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 6px;
}

.nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 8px;
    border: none;
    background: none;
    color: var(--text-muted);
    font-size: 18px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.nav-btn:hover,
.nav-btn.active {
    background: var(--bg);
    color: var(--text);
}

/* ---- Profile Card ---- */
.profile-card {
    position: absolute;
    top: calc(100% + 8px);
    right: 24px;
    width: 280px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    z-index: 200;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.profile-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border-bottom: 1px solid var(--border);
}

.profile-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(250, 128, 41, 0.15);
    color: var(--primary);
    font-size: 22px;
    flex-shrink: 0;
}

.profile-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.profile-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.profile-role {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.profile-card-footer {
    padding: 10px;
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    background: none;
    border: none;
    border-radius: 8px;
    color: #ef4444;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
}

.logout-btn:hover {
    background: rgba(239, 68, 68, 0.1);
}

/* Profile card transition */
.profile-pop-enter-active,
.profile-pop-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}
.profile-pop-enter-from,
.profile-pop-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

/* ---- Main ---- */
.commercial-main {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {

    .navbar {
        padding: 0 14px;
    }

    .nav-left {
        gap: 12px;
    }

    .nav-item span {
        display: none;
    }

    .nav-item {
        width: 45px;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;

        i {
            font-size: 20px;
        }
    }

    .commercial-main {
        padding: 16px;
    }
}
</style>