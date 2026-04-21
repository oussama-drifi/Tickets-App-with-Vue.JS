<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()
const router = useRouter()

const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark')
const showProfile = ref(false)
const profileCardRef = ref(null)
const profileBtnRef = ref(null)
const isExpanded = ref(true)

const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : '');
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const toggleProfile = () => {
    showProfile.value = !showProfile.value
}

const handleOutsideClick = (e) => {
    if (
        showProfile.value &&
        profileCardRef.value && !profileCardRef.value.contains(e.target) &&
        profileBtnRef.value && !profileBtnRef.value.contains(e.target)
    ) {
        showProfile.value = false
    }
}

const handleLogout = () => {
    showProfile.value = false
    auth.logout(router)
}

onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
    <aside
        class="sidebar"
        :class="{ 'is-expanded': isExpanded }"
    >
        <div class="sidebar-top">
            <div class="sidebar-logo">
                <img src="/logo.png" alt="Logo" />
                <button class="toggle-btn" @click="isExpanded = !isExpanded" :title="isExpanded ? 'Collapse' : 'Expand'">
                    <i class="bi" :class="isExpanded ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
                </button>
            </div>

            <nav class="sidebar-nav primary-links">
                <RouterLink :to="{ name: 'dashboard' }" class="nav-link" data-tooltip="Dashboard">
                    <i class="bi bi-columns-gap"></i>
                    <span class="nav-label">Dashboard</span>
                </RouterLink>
                <RouterLink :to="{ name: 'commercials' }" class="nav-link" data-tooltip="Commercials">
                    <i class="bi bi-people"></i>
                    <span class="nav-label">Commercials</span>
                </RouterLink>
                <RouterLink :to="{ name: 'tickets' }" class="nav-link" data-tooltip="Tickets">
                    <i class="bi bi-ticket-perforated"></i>
                    <span class="nav-label">Tickets</span>
                </RouterLink>
                <RouterLink :to="{ name: 'cards' }" class="nav-link" data-tooltip="Cards">
                    <i class="bi bi-credit-card-2-back"></i>
                    <span class="nav-label">Cards</span>
                </RouterLink>
            </nav>
        </div>

        <nav class="sidebar-nav secondary-links">
            <span class="nav-link" data-tooltip="Theme" @click="toggleTheme">
                <i v-if="isDark" class="bi bi-brightness-high"></i>
                <i v-else class="bi bi-moon"></i>
                <span class="nav-label">Theme</span>
            </span>
            <RouterLink to="/admin/settings" class="nav-link" data-tooltip="Settings">
                <i class="bi bi-gear"></i>
                <span class="nav-label">Settings</span>
            </RouterLink>
            <span ref="profileBtnRef" class="nav-link" :class="{ active: showProfile }" data-tooltip="Profile" @click="toggleProfile">
                <i class="bi bi-person"></i>
                <span class="nav-label">Profile</span>
            </span>
        </nav>

        <!-- Profile Card -->
        <Transition name="profile-card">
            <div v-if="showProfile" ref="profileCardRef" class="profile-card">
                <div class="profile-card-header">
                    <div class="profile-avatar">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <div class="profile-info">
                        <span class="profile-name">{{ auth.user?.name || 'Admin' }}</span>
                        <span class="profile-role">{{ auth.user?.role || 'Administrator' }}</span>
                    </div>
                </div>
                <div class="profile-card-body">
                    <div class="profile-detail">
                        <i class="bi bi-envelope"></i>
                        <span>{{ auth.user?.email || '—' }}</span>
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
    </aside>
</template>

<style scoped>
/* ─── Width tokens — change these two values to resize the sidebar ─── */
.sidebar {
    --sidebar-collapsed-width: 64px;
    --sidebar-expanded-width: 220px; /* ← change expanded width here */
}

.sidebar {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: var(--sidebar-collapsed-width);
    height: 100%;
    background-color: var(--surface);
    border: 2px solid var(--border);
    border-radius: clamp(8px, 1vw, 14px);
    padding: 8px;
    overflow: visible;
    flex-shrink: 0;

    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.is-expanded {
    width: var(--sidebar-expanded-width);
    align-items: flex-start;
}

/* ─── Logo ─── */
.sidebar-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-bottom: clamp(10px, 1.5vw, 20px);
    border-bottom: 1px solid var(--border);
    margin-bottom: clamp(8px, 1vw, 16px);
    gap: 8px;

    img {
        width: clamp(28px, 3.5vw, 44px);
        height: clamp(28px, 3.5vw, 44px);
        object-fit: contain;
        flex-shrink: 0;
    }
}

.toggle-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-muted);
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.2s, color 0.2s;

    i {
        font-size: 13px;
    }

    &:hover {
        background-color: var(--border);
        color: var(--text);
    }
}

.sidebar.is-expanded .sidebar-logo {
    flex-direction: row;
}

.sidebar.is-expanded .toggle-btn {
    display: flex;
    margin-left: auto;
}

.sidebar:not(.is-expanded) .toggle-btn {
    display: flex;
    width: 32px;
    height: 32px;
    border-radius: 8px;
}

/* ─── Nav groups ─── */
.sidebar-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(2px, 0.4vw, 6px);
    width: 100%;
}

.sidebar.is-expanded .sidebar-nav {
    align-items: flex-start;
}

/* ─── Nav links ─── */
.nav-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: clamp(6px, 0.8vw, 12px);
    text-decoration: none;
    color: var(--text-muted);
    transition:
        background-color 0.2s,
        color 0.2s,
        width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    flex-shrink: 0;

    i {
        font-size: clamp(16px, 2vw, 22px);
        flex-shrink: 0;
        width: 32px;
        text-align: center;
    }

    &:hover {
        background-color: var(--border);
        color: var(--text);
    }

    &.router-link-active {
        outline: 2px solid var(--primary);
        border: 2px solid var(--surface);
        background-color: var(--primary);
        color: var(--bg);
    }

    &.active {
        background-color: var(--border);
        color: var(--text);
    }

    /* Tooltip — collapsed only */
    &::after {
        content: attr(data-tooltip);
        position: absolute;
        left: calc(100% + 10px);
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--text);
        color: var(--bg);
        font-size: 12px;
        font-weight: 500;
        padding: 6px 10px;
        border-radius: 6px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 100;
    }

    &::before {
        content: '';
        position: absolute;
        left: calc(100% + 4px);
        top: 50%;
        transform: translateY(-50%);
        border: 4px solid transparent;
        border-right-color: var(--text);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 100;
    }

    &:hover::after,
    &:hover::before {
        opacity: 1;
    }
}

/* ─── Expanded nav-link overrides ─── */
.sidebar.is-expanded .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 0 8px;
    gap: 10px;

    /* hide tooltip in expanded state */
    &::after,
    &::before {
        display: none;
    }
}

/* ─── Label ─── */
.nav-label {
    font-size: 13px;
    font-weight: 500;
    color: inherit;
    opacity: 0;
    max-width: 0;
    overflow: hidden;
    transition:
        opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.sidebar.is-expanded .nav-label {
    opacity: 1;
    max-width: 160px;
    pointer-events: auto;
}

/* ─── Secondary nav ─── */
.secondary-links {
    border-top: 1px solid var(--border);
    padding-top: clamp(8px, 1vw, 16px);
}

/* ─── Profile Card ─── */
.profile-card {
    position: absolute;
    bottom: 10px;
    left: calc(100% + 12px);
    width: 280px;
    background-color: var(--surface);
    border: 2px solid var(--border);
    border-radius: 12px;
    z-index: 200;
    overflow: hidden;

    .profile-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        border-bottom: 1px solid var(--border);

        .profile-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background-color: rgba(245, 158, 11, 0.15);
            color: #f59e0b;
            font-size: 22px;
            flex-shrink: 0;
        }

        .profile-info {
            display: flex;
            flex-direction: column;
            min-width: 0;

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
                text-transform: capitalize;
            }
        }
    }

    .profile-card-body {
        padding: 12px 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .profile-detail {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            color: var(--text-muted);

            i {
                font-size: 15px;
                width: 18px;
                text-align: center;
                flex-shrink: 0;
            }

            span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .profile-card-footer {
        padding: 10px;
        border-top: 1px solid var(--border);

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
            transition: background-color 0.2s;

            &:hover {
                background-color: rgba(239, 68, 68, 0.1);
            }

            i {
                font-size: 16px;
            }
        }
    }
}

/* ─── Profile card transition ─── */
.profile-card-enter-active,
.profile-card-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.profile-card-enter-from,
.profile-card-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

/* ─── Tablet ─── */
@media (max-width: 1024px) {
    .sidebar {
        --sidebar-collapsed-width: 56px;
    }
}

/* ─── Mobile: bottom nav bar ─── */
@media (max-width: 768px) {
    .sidebar {
        flex-direction: row;
        width: 100% !important;
        height: auto;
        padding: 8px 12px;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 50;
        border-radius: 0;
        border-width: 2px 0 0 0;
        align-items: center;
        transition: none;
    }

    .sidebar-top {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .sidebar-logo {
        padding-bottom: 0;
        border-bottom: none;
        margin-bottom: 0;
        padding-right: 8px;
        border-right: 1px solid var(--border);
        margin-right: 4px;
        width: auto;

        img {
            width: 24px;
            height: 24px;
        }
    }

    .sidebar-nav {
        flex-direction: row;
        gap: 4px;
        align-items: center;
        width: auto;
    }

    .nav-link {
        width: 40px !important;
        height: 40px;
        padding: 0 !important;
        justify-content: center !important;
    }

    .nav-label {
        display: none;
    }

    .nav-link::after,
    .nav-link::before {
        display: none;
    }

    .secondary-links {
        border-top: none;
        padding-top: 0;
        border-left: 1px solid var(--border);
        padding-left: 4px;
    }

    .profile-card {
        bottom: calc(100% + 12px);
        left: auto;
        right: 0;
        width: 260px;
    }
}
</style>
