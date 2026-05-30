<script setup>
import { SquareArrowRightExit, PanelLeft, Moon, Headset, ChartLine, ChevronLeft, ChevronUp, ChevronsUpDown, ChevronDown, ChevronsRight, CalendarDays, AlignEndHorizontal, Sun, DollarSign, Settings, LayoutDashboard, Users, CreditCard, Ticket, Plus, FileText, ChartSpline } from '@lucide/vue';
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore()
const router = useRouter()

// theme logic
const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark')
const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : '');
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
// sidebar & sub-menu
const isSubMenuShown = ref(false)
const isCollapsed = ref(false)
function toggleSidebar () {
    if (!isCollapsed.value && isSubMenuShown.value) {
        isSubMenuShown.value = false
    }
    isCollapsed.value = !isCollapsed.value
}
function toggleSubMenu() {
    isSubMenuShown.value = !isSubMenuShown.value
    isCollapsed.value = false
}
// profile
const { user } = auth
const showProfile = ref(false)
const toggleProfile = () => {
    showProfile.value = !showProfile.value
}
const handleLogout = () => {
    showProfile.value = false
    auth.logout(router)
}

</script>

<template>
<aside :class="['sidebar', { collapsed: isCollapsed }]">
    <div class="sidebar-header">
        <div class="logo" @click="isCollapsed && toggleSidebar()">
            <img src="/favicon.svg" alt="logo">
            <span v-if="!isCollapsed">Ticky</span>
        </div>
        <button class="toggle-btn" @click="toggleSidebar()">
            <PanelLeft />
        </button>
    </div>

    <ul class="nav">
        <li>
            <RouterLink :to="{ name: 'dashboard' }" class="nav-link" data-tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
            </RouterLink>
        </li>
        <li>
            <RouterLink :to="{ name: 'commercials' }" class="nav-link" data-tooltip="Commercials">
                <Users />
                <span>Commercials</span>
            </RouterLink>
        </li>
        <li>
            <button class="nav-link" @click="toggleSubMenu()" data-tooltip="Create">
                <Plus />
                <span>Create</span>
                <ChevronDown class="chevron" :class="{ rotate: isSubMenuShown }" />
            </button>
            <ul :class="['sub-menu', { shown: isSubMenuShown }]">
                <div>
                    <li><a href="#">Ticket</a></li>
                    <li><a href="#">Commercial</a></li>
                    <li><a href="#">Card</a></li>
                </div>
            </ul>
        </li>
        <li>
            <RouterLink :to="{ name: 'tickets' }" class="nav-link" data-tooltip="Tickets">
                <Ticket />
                <span>Tickets</span>
            </RouterLink>
        </li>
        <li>
            <RouterLink :to="{ name: 'cards' }" class="nav-link" data-tooltip="Cards">
                <CreditCard />
                <span>Cards</span>
            </RouterLink>
        </li>
        <li>
            <RouterLink :to="{ name: 'analytics' }" class="nav-link" data-tooltip="Analytics">
                <AlignEndHorizontal />
                <!-- <ChartLine /> -->
                <span>Analytics</span>
            </RouterLink>
        </li>
        <li>
            <RouterLink :to="{ name: 'documents' }" class="nav-link" data-tooltip="Documents">
                <FileText />
                <span>Documents</span>
            </RouterLink>
        </li>
        <li>
            <RouterLink :to="{ name: 'payments' }" class="nav-link" data-tooltip="Payments">
                <DollarSign />
                <span>Payments</span>
            </RouterLink>
        </li>
        <li>
            <RouterLink :to="{ name: 'calendar' }" class="nav-link" data-tooltip="Schedule">
                <CalendarDays />
                <span>Schedule</span>
            </RouterLink>
        </li>
        <li>
            <RouterLink :to="{ name: 'support'}" class="nav-link" data-tooltip="Support">
                <Headset />
                <span>Support</span>
            </RouterLink>
        </li>
        <li>
            <RouterLink :to="{ name: 'settings'}" class="nav-link" data-tooltip="Settings">
                <Settings />
                <span>Settings</span>
            </RouterLink>
        </li>
        <li>
            <button class="nav-link" @click="toggleTheme()" data-tooltip="Theme">
                <Sun v-if="isDark"/>
                <Moon v-else/>
                <span style="text-wrap: nowrap;">{{ isDark ? "Light mode" : "Dark mode"}}</span>
            </button>
        </li>
    </ul>

    <div class="profile-zone" @click="toggleProfile">
        <div class="profile">
            <div class="image">
                <img src="/avatar4.png" alt="avatar not found" loading="lazy">
            </div>
            <div class="info">
                <span>{{ user.name }}</span>
                <!-- <span>role: {{ role.toLowerCase() }}</span> -->
                <span>{{ auth.user?.email }}</span>
            </div>
            <div class="btn-wrapper" @click="handleLogout">
                <button><SquareArrowRightExit /></button>
            </div>
        </div>
    </div>
</aside>
</template>


<style scoped>


.sidebar {
    width: 260px;
    padding: 5px 1em;
    border-right: .5px solid var(--border);
    height: 100vh;
    position: relative;
    transition: .25s ease-in-out;
    overflow: hidden;
    background-color: var(--surface);
    display: flex;
    flex-direction: column;

    .toggle-btn {
        background-color: transparent;
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        margin-left: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--text-extra-muted);
        cursor: pointer;
        border: none;
        transition: opacity .25s ease-in-out;

        svg {
            transition: rotate .2s ease;
        }
    }

    .sidebar-header {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        flex-shrink: 0;
        padding: 4px 7px;
        height: 36px;

        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;

            img {
                flex-shrink: 0;
                width: 32px;
                height: 32px;
                display: block;
            }

            span {
                white-space: nowrap;
                font-weight: 600;
            }
        }
    }

    .nav {
        flex: 1;
        overflow: hidden auto;

        li {
            margin-bottom: 3px;
        }
        li:has(.router-link-active) {
            .nav-link {
                background-color: var(--primary-bg-color);
                color: var(--primary);
            }
        }
    }

    .nav-link {
        padding: 4px 7px;
        color: var(--text-extra-muted);
        border-radius: 4px;
        align-items: center;
        display: flex;
        gap: 1em;
        transition-duration: 0.25s;
    }
    button.nav-link {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        font: inherit;
        cursor: pointer;
    }

    svg {
        flex-shrink: 0;
        transition-duration: .25s;

        &.rotate {
            rotate: 180deg;
        }
    }
    .nav-link span {
        flex-grow: 1;
    }
    .nav-link:hover {
        background-color: var(--primary-bg-color);
        color: var(--primary);
    }

    .sub-menu {
        display: grid;
        grid-template-rows: 0fr;
        transition: 0.3s ease-in-out;
        position: relative;
        &::before {
            position: absolute;
            content: "";
            width: 2px;
            height: 100%;
            left: 17px;
            top: 0;
            background-color: var(--border);
        }

        > div {
            overflow: hidden;
        }
        &.shown {
            grid-template-rows: 1fr;
        }

        a {
            padding-left: 2em;
            color: var(--text-extra-muted);
            transition: 0.25s;

            &:hover {
                color: var(--primary);
            }
        }
    }

    .profile-zone {
        padding: 8px 0;

        .profile {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 1em;
            margin-top: 8px;
    
            .image {
                flex-shrink: 0;
                display: flex;
            }
            .image img {
                width: 35px;
                display: block;
                border-radius: 8px;
            }
    
            .info {
                flex: 1;
                min-width: 0;
                text-wrap: nowrap;
                display: flex;
                flex-direction: column;
    
                span:first-child {
                    font-size: 14px;
                }
                span:last-child {
                    color: var(--text-extra-muted);
                    font-size: 12px;
                }
            }
    
            .btn-wrapper button {
                background: transparent;
                border: none;
                cursor: pointer;
                color: var(--text-extra-muted);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4px;
                transition-duration: 0.25s;
                border-radius: 5px;

                &:hover {
                    background-color: var(--danger-background-color);
                    color: rgb(255, 43, 43);
                }
            }
        }

    }

    &.collapsed {
        padding: 12px;
        width: 60px;

        .nav-link {
            padding: 4px 6px;
        }

        .sidebar-header {
            padding: 4px 6px;

            .logo {
                cursor: pointer;
            }

            .toggle-btn {
                opacity: 0;
                pointer-events: none;
            }
        }

        .profile-zone {
            padding: 8px 0;
        }
    }
}
</style>
