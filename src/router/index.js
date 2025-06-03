import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import VumetroView from '@/views/VumetroView.vue'
import Retransmision from '@/views/Retransmision.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/vumetro',
      name: 'vumetro',
      component: VumetroView,
    },
    {
      path: '/retransmision',
      name: 'retransmision',
      component: Retransmision,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
