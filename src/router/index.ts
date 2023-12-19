import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/accelerate',
    },
    {
      path: '/accelerate',
      component: () => import('../views/AccelerateView.vue'),
    },
    {
      path: '/map-zoom',
      component: () => import('../views/MapZoomView.vue'),
    },
  ],
});

export default router;
