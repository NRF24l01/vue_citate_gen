import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllQuotas from '@/views/AllQuotas.vue'
import GenQuote from '@/views/GenQuote.vue'
import History from '@/views/History.vue'

import { getAccessToken, getCustomClaims } from '@/utils/jwt';
import { updateAuthState } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/all',
      name: 'all_quotas',
      component: AllQuotas,
    },
    {
      path: '/user/my_quotes',
      name: 'my_quotes',
      meta: { requiresAuth: true },
      component: () => import('../views/MyQuotes.vue'),
    },
    {
      path: '/gen',
      name: 'generate_quote',
      meta: { requiresAuth: true},
      component: () => import('../views/GenQuote.vue'),
    },
    {
      path: '/create',
      name: 'create_quote',
      meta: { requiresAuth: true},
      component: () => import('../views/NewQuote.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/History.vue'),
      meta: { requiresAuth: true},
    },
    {
      path: '/auth/login',
      name: 'login',
      meta: { noIfAuth: true},
      component: () => import('../views/auth/Login.vue'),
    },
    {
      path: '/auth/register',
      name: 'register',
      meta: { noIfAuth: true},
      component: () => import('../views/auth/Register.vue'),
    },
    {
      path: '/moderation/list',
      name: 'moderation_list',
      meta: { requiresAuth: true, requiresRole: 'moderator' },
      component: () => import('../views/moderation/UnModerated.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not_found',
      component: () => import('../views/errors/404.vue'),
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
})

router.beforeEach((to, from, next) => {
  // Update auth state on each navigation
  updateAuthState();
  
  const token = getAccessToken();
  if (!token && to.name !== 'login' && to.meta.requiresAuth) {
    next({ name: 'login' });
    return;
  }
  const decodedToken = getCustomClaims(token);

  if (decodedToken && to.meta.requiresRole) {
    const userRole = decodedToken.role;
    if (userRole !== to.meta.requiresRole) {
      next({ name: 'not_found' });
      return;
    }
  }

  if (token && to.meta.noIfAuth) {
    next({ name: "home" });
    return;
  }

  next();
});

export default router
