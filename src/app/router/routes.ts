import type { RouteRecordRaw } from 'vue-router'

import { v2vRoutes } from './v2v.routes'

/**
 * 전체 라우트 목록.
 *
 * feature가 늘어나면 `*.routes.ts` 파일을 만들고 여기서 spread 한다.
 * 페이지 등록은 이 파일과 해당 feature routes 파일만 건드리면 된다.
 */
export const routes: RouteRecordRaw[] = [
  ...v2vRoutes,
  // ...authRoutes,
  // ...dashboardRoutes,

  // 매칭되지 않는 경로
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
]
