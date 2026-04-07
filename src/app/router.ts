import { createRouter, createWebHistory } from 'vue-router'

import V2vPage from '@/pages/v2v/v2v-page.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'v2v',
      component: V2vPage,
    },
  ],
})
