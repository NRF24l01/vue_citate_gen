import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllQuotas from '@/views/AllQuotas.vue'
import GenQuote from '@/views/GenQuote.vue'
import History from '@/views/History.vue'

import { jwtDecode } from "jwt-decode";

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
      path: '/gen',
      name: 'generate_quote',
      component: GenQuote,
    },
    {
      path: '/history',
      name: 'history',
      component: History,
      meta: { requiresAuth: true},
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('../views/auth/Register.vue'),
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

interface DecodedJwt {
  access?: string;
  [key: string]: any;
}

function decodeJwt(token: string): DecodedJwt | null {
  try {
    return jwtDecode<DecodedJwt>(token);
  } catch (error) {
    console.error("Invalid JWT", error);
    return null;
  }
}

function getCustomClaims(token: string | null): DecodedJwt | null {
  if (!token) {
    return null;
  }
  return decodeJwt(token);
}

function isTokenExpired(token: string): boolean {
  const decodedToken = decodeJwt(token);
  if (!decodedToken || !decodedToken.exp) {
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  return Date.now() >= decodedToken.exp * 1000;
}

function noTokenIfExpired(token: string | null): string | null {
  if (!token) {
    return null;
  }
  if (isTokenExpired(token)) {
    localStorage.removeItem("access_token");
    token = null;
  }
  return token;
}

router.beforeEach((to, from, next) => {
  const token = noTokenIfExpired(localStorage.getItem("access_token"));
  if (!token && to.name !== 'login' && to.meta.requiresAuth) {
    next({ name: 'login' });
    return;
  }
  const decodedToken = getCustomClaims(token);

  next();
});


export default router
