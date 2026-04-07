# 네이밍 규칙

이 프로젝트의 파일/폴더/심볼 네이밍 규칙이다.

---

## 파일 / 폴더

- 모두 **kebab-case**
- camelCase, PascalCase 파일명은 지양

좋은 예시:
- `user-list.vue`
- `use-user-list.controller.ts`
- `auth.store.ts`
- `dashboard-api.ts`
- `sales-chart-renderer.ts`

지양 예시:
- `UserList.vue`
- `useUserList.ts`
- `dashboardAPI.ts`
- `BarChartRenderer.ts`

---

## Vue 컴포넌트

- 파일명: kebab-case
- 컴포넌트명(코드 내부): PascalCase 가능

예시:
- 파일명: `user-profile-card.vue`
- 컴포넌트명: `UserProfileCard`

---

## Controller composable

비즈니스 흐름을 포함하면 `.controller.ts`를 사용한다.

패턴:
- `use-{domain}.controller.ts`
- `use-{feature}-{action}.controller.ts`

예시:
- `use-login.controller.ts`
- `use-dashboard-filter.controller.ts`
- `use-sales-chart.controller.ts`
- `use-v2v-download.controller.ts`

---

## 일반 composable

범용 UI 보조/유틸은 `.controller.ts`를 붙이지 않는다.

예시:
- `use-debounce.ts`
- `use-resize-observer.ts`
- `use-scroll-lock.ts`
- `use-i18n.ts`

---

## Store

- `{domain}.store.ts`

예시:
- `auth.store.ts`
- `dashboard.store.ts`
- `user-preference.store.ts`

---

## API

- `{domain}-api.ts`

예시:
- `auth-api.ts`
- `report-api.ts`
- `user-api.ts`
- `analysis-fields-api.ts`

---

## Types

- `{domain}.types.ts`

예시:
- `dashboard.types.ts`
- `v2v.types.ts`
- `analysis-field.types.ts`

---

## D3 / lib

- `{chart}-renderer.ts`
- `{chart}-options.ts`
- `{feature}-{purpose}.ts`

예시:
- `sales-chart-renderer.ts`
- `sales-chart-options.ts`
- `v2v-export-payload.ts`
