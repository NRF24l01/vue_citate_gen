import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllQuotas from '@/views/AllQuotas.vue'
import GenQuote from '@/views/GenQuote.vue'
import History from '@/views/History.vue'

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
    }
  ],
})

export default router
