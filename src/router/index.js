import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/pages/LoginPage.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/AdminView.vue'),
    redirect: { name: 'dashboard' },
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/pages/DashboardPage.vue')
      },
      {
        path: 'commercials',
        name: 'commercials',
        component: () => import('@/views/pages/Commercials.vue'),
        redirect: { name: 'commercial-all' },
        children: [
          {
            path: 'all',
            name: 'commercial-all',
            component: () => import('@/views/pages/CommercialsPage.vue')
          },
          {
            path: 'details/:id?',
            name: 'commercial-details',
            component: () => import('@/views/pages/CommercialDetails.vue')
          }
        ]
      },
      {
        path: 'tickets',
        name: 'tickets',
        component: () => import('@/views/pages/TicketsPage.vue')
      },
      {
        path: 'cards',
        name: 'cards',
        component: () => import('@/views/pages/CardsPage.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/pages/SettingsPage.vue')
      }
    ]
  },
  {
    path: '/commercial',
    name: 'commercial',
    component: () => import('@/views/commercial/CommercialView.vue'),
    redirect: { name: 'commercial-tickets' },
    meta: { requiresAuth: true, role: 'commercial' },
    children: [
      {
        path: 'tickets',
        name: 'commercial-tickets',
        component: () => import('@/views/commercial/CommercialTickets.vue')
      },
      {
        path: 'new-ticket',
        name: 'commercial-new-ticket',
        component: () => import('@/views/commercial/NewTicket.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // On first load, try to restore session from token
  if (!authStore.isAuthenticated && authStore.token) {
    await authStore.fetchUser()
  }

  const isAuth = authStore.isAuthenticated
  const role = authStore.role

  // Not authenticated → must go to login
  if (to.meta.requiresAuth && !isAuth) {
    return { name: 'login' }
  }

  // Authenticated user hitting login or root → redirect to their interface
  if (isAuth && (to.name === 'login' || to.path === '/')) {
    return role === 'admin' ? { name: 'dashboard' } : { name: 'commercial' }
  }

  // Role mismatch → redirect to correct interface
  if (isAuth && to.meta.role && to.meta.role !== role) {
    return role === 'admin' ? { name: 'dashboard' } : { name: 'commercial' }
  }
})

export default router
