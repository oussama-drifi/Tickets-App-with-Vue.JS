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
    <aside class="sidebar">
        <div class="sidebar-top">
            <div class="sidebar-logo">
                <img src="/logo.png" alt="Logo" />
            </div>

            <nav class="sidebar-nav primary-links">
                <RouterLink :to="{ name: 'dashboard' }" class="nav-link" data-tooltip="Dashboard">
                    <i class="bi bi-columns-gap"></i>
                </RouterLink>
                <RouterLink :to="{ name: 'commercials' }" class="nav-link" data-tooltip="Commercials">
                    <i class="bi bi-people"></i>
                </RouterLink>
                <RouterLink :to="{ name: 'tickets' }" class="nav-link" data-tooltip="Tickets">
                    <i class="bi bi-ticket-perforated"></i>
                </RouterLink>
                <RouterLink :to="{ name: 'cards' }" class="nav-link" data-tooltip="Cards">
                    <i class="bi bi-credit-card-2-back"></i>
                </RouterLink>
            </nav>
        </div>

        <nav class="sidebar-nav secondary-links">
            <span class="nav-link" data-tooltip="Theme" @click="toggleTheme">
                <i v-if="isDark" class="bi bi-brightness-high"></i>
                <i v-else class="bi bi-moon"></i>
            </span>
            <RouterLink to="/admin/settings" class="nav-link" data-tooltip="Settings">
                <i class="bi bi-gear"></i>
            </RouterLink>
            <span ref="profileBtnRef" class="nav-link" :class="{ active: showProfile }" data-tooltip="Profile" @click="toggleProfile">
                <i class="bi bi-person"></i>
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
.sidebar {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: clamp(48px, 5vw, 72px);
    height: 100%;
    background-color: var(--surface);
    border: 2px solid var(--border);
    border-radius: clamp(8px, 1vw, 14px);
    padding: 5px;
}

.sidebar-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: clamp(10px, 1.5vw, 20px);
    border-bottom: 1px solid var(--border);
    margin-bottom: clamp(8px, 1vw, 16px);

    img {
        width: clamp(28px, 3.5vw, 44px);
        height: clamp(28px, 3.5vw, 44px);
        object-fit: contain;
    }
}


.sidebar-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(2px, 0.4vw, 6px);
}

.nav-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(36px, 4vw, 54px);
    height: clamp(36px, 4vw, 54px);
    border-radius: clamp(6px, 0.8vw, 12px);
    text-decoration: none;
    color: var(--text-muted);
    transition: background-color 0.2s, color 0.2s;
    cursor: pointer;

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
    i {
        font-size: clamp(16px, 2vw, 28px);
    }

    /* Custom tooltip */
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
    
    &.active {
        background-color: var(--border);
        color: var(--text);
    }
}

.secondary-links {
    border-top: 1px solid var(--border);
    padding-top: clamp(8px, 1vw, 16px);
}

/* Profile Card */
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
        padding: 10px 10px;
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






/* Profile card transition */
.profile-card-enter-active,
.profile-card-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.profile-card-enter-from,
.profile-card-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

/* Tablet: compact sidebar */
@media (max-width: 1024px) {
    .sidebar {
        width: clamp(44px, 6vw, 56px);
    }
}

/* Mobile: sidebar becomes a bottom navigation bar */
@media (max-width: 768px) {
    .sidebar {
        flex-direction: row;
        width: 100%;
        height: auto;
        padding: 8px 12px;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 50;
        border-radius: 0;
        border-width: 2px 0 0 0;
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
    }

    .sidebar-logo img {
        width: 24px;
        height: 24px;
    }

    .sidebar-nav {
        flex-direction: row;
        gap: 4px;
    }

    .nav-link {
        width: 40px;
        height: 40px;
    }

    .nav-link i {
        font-size: 20px;
    }

    /* Hide tooltips on mobile (use touch, no hover) */
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