import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'

/**
 * 앱 전체의 단일 라우터 인스턴스.
 *
 * 라우트 정의는 `routes.ts` 와 `*.routes.ts` 에 분리되어 있다.
 * 이 파일은 인스턴스 생성과 전역 가드 설정에만 집중한다.
 */
export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})
