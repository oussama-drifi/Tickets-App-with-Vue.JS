# Layout Components

**Location**: `src/components/layout/`

## Overview

Components that form the main application layout including navigation, sidebar, and main content area.

---

## NavBar.vue

**Purpose**: Top navigation bar with user menu and branding

**Props**:
- `user` (object): Current user data
  - `email`: User email
  - `role`: User role (admin, commercial)
- `isLoading` (boolean): Show loading state

**Emits**:
- `@logout`: When user clicks logout (no payload)
- `@navigate`: When user clicks navigation link (payload: route path)
- `@toggle-theme`: When theme toggle clicked

**Features**:
- Application branding/logo
- User profile dropdown
- Theme toggle (light/dark)
- Logout button
- Role-based menu items
- Responsive mobile menu
- Notification badge

**Structure**:
```
NavBar
├── Logo/Branding
├── Search Bar (optional)
├── Navigation Links
├── Theme Toggle
└── User Menu
    ├── Profile
    ├── Settings
    └── Logout
```

**Example**:
```vue
<NavBar
  :user="authStore.currentUser"
  :is-loading="isLoading"
  @logout="handleLogout"
  @navigate="handleNavigate"
  @toggle-theme="toggleTheme"
/>
```

---

## SideBar.vue

**Purpose**: Left sidebar navigation with collapsible menu

**Props**:
- `isCollapsed` (boolean): Sidebar collapse state
- `userRole` (string): User role for conditional menu items
- `activeRoute` (string): Current active route

**Emits**:
- `@toggle-collapse`: When sidebar toggle clicked
- `@navigate`: When menu item clicked (payload: route path)

**Menu Items** (role-based):
- **Admin**:
  - Dashboard
  - Commercials
  - Cards
  - Payments
  - Reports
  - Settings
- **Commercial**:
  - My Dashboard
  - My Tickets
  - My Cards
  - My Payments
  - Profile

**Features**:
- Collapsible sections
- Active item highlighting
- Icon support
- Nested menu groups
- Scroll area with overflow handling
- Keyboard navigation support

**Structure**:
```
SideBar
├── Menu Section 1
│   ├── Menu Item 1
│   ├── Menu Item 2
│   └── Submenu
├── Menu Section 2
└── Settings/Help
```

**Example**:
```vue
<SideBar
  :is-collapsed="isSidebarCollapsed"
  :user-role="authStore.currentUser?.role"
  :active-route="$route.name"
  @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
  @navigate="handleNavigation"
/>
```

---

## Main.vue

**Purpose**: Main content wrapper with layout structure

**Props**:
- `isSidebarCollapsed` (boolean): Sidebar state for layout adjustment

**Slots**:
- `default`: Main content area

**Features**:
- Responsive grid layout
- Flex layout with sidebar
- Adjusts width based on sidebar state
- Content padding and spacing
- Smooth transitions

**Structure**:
```
Main
├── Sidebar
├── Content Area
│   ├── NavBar
│   └── Page Content
└── Aside (optional)
```

**Example**:
```vue
<Main :is-sidebar-collapsed="isSidebarCollapsed">
  <router-view />
</Main>
```

---

## Aside.vue

**Purpose**: Right sidebar for additional content (optional)

**Props**:
- `isOpen` (boolean): Aside panel visibility
- `title` (string): Panel title
- `width` (string): Panel width (default: 300px)

**Slots**:
- `header`: Custom header content
- `default`: Main content area
- `footer`: Footer area

**Emits**:
- `@close`: When close button clicked

**Features**:
- Slidable panel
- Custom width
- Title/header area
- Footer area
- Overlay on mobile
- Smooth animations
- Close button

**Example**:
```vue
<Aside
  :is-open="showAside"
  title="Details"
  @close="showAside = false"
>
  <template #default>
    <p>Panel content here</p>
  </template>
</Aside>
```

---

## Complete Layout Structure

```vue
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/layout/NavBar.vue'
import SideBar from '@/components/layout/SideBar.vue'
import Main from '@/components/layout/Main.vue'
import Aside from '@/components/layout/Aside.vue'

const authStore = useAuthStore()
const isSidebarCollapsed = ref(false)
const showAside = ref(false)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-layout">
    <NavBar
      :user="authStore.currentUser"
      @logout="handleLogout"
      @toggle-theme="toggleTheme"
    />

    <div class="app-body">
      <SideBar
        :is-collapsed="isSidebarCollapsed"
        :user-role="authStore.currentUser?.role"
        @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
      />

      <Main :is-sidebar-collapsed="isSidebarCollapsed">
        <router-view />
      </Main>

      <Aside
        :is-open="showAside"
        @close="showAside = false"
      >
        <router-view name="aside" />
      </Aside>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
```

---

## Responsive Behavior

- **Mobile** (< 768px):
  - Sidebar collapses to icon bar
  - Aside overlay becomes full-width
  - NavBar menu becomes hamburger
- **Tablet** (768px - 1024px):
  - Sidebar toggle available
  - Aside panel visible
- **Desktop** (> 1024px):
  - All components visible
  - Full layout without overlays

---

## Theme Support

All components support light/dark theme:
```css
[data-theme="light"] {
  --color-bg: #fff;
  --color-text: #000;
}

[data-theme="dark"] {
  --color-bg: #1e1e1e;
  --color-text: #fff;
}
```

---

## Navigation Integration

Components integrate with Vue Router:
- Active route highlighting in sidebar
- Menu item navigation
- Breadcrumb support
- Router state sync
