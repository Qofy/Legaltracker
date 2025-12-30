import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cases',
    name: 'Cases',
    component: () => import('../views/Cases.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'lawyer'] },
  },
  {
    path: '/cases/:id',
    name: 'CaseDetails',
    component: () => import('../views/CaseDetails.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-cases',
    name: 'MyCases',
    component: () => import('../views/MyCases.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('../views/Documents.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/documents/:id',
    name: 'DocumentViewer',
    component: () => import('../views/DocumentViewer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('../views/Schedule.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/legal-research',
    name: 'LegalResearch',
    component: () => import('../views/LegalResearch.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'lawyer'] },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/Help.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/guest-access',
    name: 'GuestAccess',
    component: () => import('../views/GuestAccess.vue'),
    meta: { public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Development mode: Auto-login if not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🔓 Development mode: Auto-logging in as admin');
    authStore.fakeLogin('admin');
  }

  // Check if route requires authentication (after fake login attempt)
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires specific roles
  if (to.meta.roles && !authStore.hasRole(...to.meta.roles)) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router
