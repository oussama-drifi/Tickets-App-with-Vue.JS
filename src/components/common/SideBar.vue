<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue';

const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark')

const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : '');
}
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
                    <i class="bi bi-ticket-detailed"></i>
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
            <span class="nav-link" data-tooltip="Profile">
                <i class="bi bi-person"></i>
            </span>
        </nav>
    </aside>
</template>

<style scoped>
.sidebar {
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
    padding-bottom: clamp(10px, 1.5vw, 20px);
    border-bottom: 1px solid var(--border);
    margin-bottom: clamp(8px, 1vw, 16px);
    width: 50px;
    height: 50px;
    object-fit: cover;
}

.sidebar-logo img {
    /* width: clamp(22px, 2.5vw, 36px); */
    width: 100%;
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
}

.nav-link:hover {
    background-color: var(--border);
    color: var(--text);
}

.nav-link.router-link-active {
    outline: 2px solid var(--primary);
    border: 2px solid var(--surface);
    background-color: var(--primary);
    color: var(--bg);
}

.nav-link i {
    font-size: clamp(16px, 2vw, 28px);
}

/* Custom tooltip */
.nav-link::after {
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

.nav-link::before {
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

.nav-link:hover::after,
.nav-link:hover::before {
    opacity: 1;
}

.secondary-links {
    border-top: 1px solid var(--border);
    padding-top: clamp(8px, 1vw, 16px);
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
        border-radius: 12px 12px 0 0;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 50;
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
}
</style>
