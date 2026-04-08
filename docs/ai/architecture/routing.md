# 라우팅 가이드

이 프로젝트는 **Vue Router 4** 를 라우팅 기준으로 사용한다.
현재 실제 구조는 `src/app/router/` 아래에 라우팅 파일을 분리하는 방식이다.

---

## 현재 구조

```txt
src/
├─ app/
│  └─ router/
│     ├─ index.ts
│     ├─ routes.ts
│     └─ v2v.routes.ts
└─ pages/
   └─ v2v/
      └─ v2v-page.vue
```

---

## 핵심 원칙

1. 페이지 추가 = 라우트 등록
2. 페이지 컴포넌트는 lazy import 사용
3. feature 단위 라우트 파일(`*.routes.ts`)로 분리
4. router 인스턴스 생성과 라우트 목록 합성은 분리
5. 페이지는 `pages/`, 라우트 정의는 `app/router/` 에 둔다

---

## 파일별 책임

### `src/app/router/index.ts`

- `createRouter()` 호출
- `createWebHistory()` 설정
- `scrollBehavior` 설정
- 추후 전역 guard 위치

### `src/app/router/routes.ts`

- feature 라우트들을 합쳐 전체 라우트 배열 생성
- `not-found` 같은 fallback 라우트 배치

### `src/app/router/v2v.routes.ts`

- `v2v` feature 페이지 라우트 정의
- 현재 `/` 경로를 `v2v-page.vue` 에 연결

---

## 현재 패턴 예시

```ts
import type { RouteRecordRaw } from 'vue-router'

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
```

---

## 새 페이지 추가 규칙

1. `src/pages/{feature}/{name}-page.vue` 생성
2. `src/app/router/{feature}.routes.ts` 에 라우트 추가
3. `src/app/router/routes.ts` 에 spread 추가
4. 필요 시 `meta` 와 guard 정의 추가

---

## 권장 사항

- `router.push` 는 경로 문자열보다 `name` 기반 호출을 우선한다.
- route `meta` 는 제목, 권한, 브레드크럼 같은 라우팅 메타 정보에 사용한다.
- 전역 guard 가 생기면 `index.ts` 에 둔다.

---

## 피해야 하는 패턴

- 페이지 컴포넌트를 정적 import 로 모두 등록하는 것
- 모든 라우트를 한 파일에 몰아넣는 것
- `features/` 내부에 page 라우트 정의를 두는 것
- 라우트 등록 없이 페이지를 직접 동적 렌더링하는 것
