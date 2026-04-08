import type { RouteRecordRaw } from 'vue-router'

/**
 * v2v 페이지 라우트 정의.
 *
 * 페이지 컴포넌트는 lazy import 한다.
 *  - 첫 진입 시에만 chunk가 로드되어 초기 번들 크기를 줄인다.
 *  - 라우트 등록 = 페이지 등록. 새 페이지가 생기면 이 파일에 추가하고
 *    `routes.ts` 가 알아서 합쳐준다.
 */
export const v2vRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'v2v',
    component: () => import('@/pages/v2v/v2v-page.vue'),
    meta: {
      titleKey: 'v2v.title',
    },
  },
]
