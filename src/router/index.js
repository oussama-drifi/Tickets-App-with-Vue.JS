import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    redirect: { name: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'commercials',
        name: 'commercials',
        component: () => import('@/views/Commercials.vue'),
        redirect: { name: 'commercial-all' },
        children: [
          {
            path: 'all',
            name: 'commercial-all',
            component: () => import('@/views/AllCommercials.vue')
          },
          {
            path: 'details/:id?',
            name: 'commercial-details',
            component: () => import('@/views/CommercialDetails.vue')
          }
        ]
      },
      {
        path: 'tickets',
        name: 'tickets',
        component: () => import('@/views/Tickets.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router