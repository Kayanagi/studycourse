import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase.js'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Subjects from '../views/Subjects.vue'
import Revisions from '../views/Revisions.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/subjects',
    name: 'Subjects',
    component: Subjects,
    meta: { requiresAuth: true }
  },
  {
    path: '/revisions',
    name: 'Revisions',
    component: Revisions,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Garde de navigation
router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user || null

  if (to.meta.requiresAuth && !user) {
    return next({ name: 'Login' })
  }

  if (to.name === 'Login' && user) {
    return next({ name: 'Dashboard' })
  }

  return next()
})

export default router
