# 네이밍 규칙

이 프로젝트의 파일, 폴더, 심볼 네이밍 규칙이다.

---

## 파일 / 폴더

- 모두 kebab-case
- camelCase, PascalCase 파일명은 지양

좋은 예시:

- `v2v-page.vue`
- `use-v2v-download.controller.ts`
- `analysis-fields-api.ts`
- `analysis-field.types.ts`
- `date-range.constants.ts`

지양 예시:

- `V2VPage.vue`
- `useV2vDownload.ts`
- `analysisFieldsApi.ts`

---

## Vue 컴포넌트

- 파일명은 kebab-case
- 코드 내부 컴포넌트 식별자는 PascalCase 가능

예시:

- 파일명: `download-modal.vue`
- import 식별자: `DownloadModal`

---

## Controller composable

비즈니스 흐름을 포함하면 `.controller.ts` 를 사용한다.

패턴:

- `use-{domain}.controller.ts`
- `use-{feature}-{action}.controller.ts`

예시:

- `use-analysis-fields.controller.ts`
- `use-v2v-download.controller.ts`
- `use-date-range-filter.controller.ts`

---

## 일반 composable

범용 보조 composable 은 `.controller.ts` 를 붙이지 않는다.

예시:

- `use-i18n.ts`
- `use-debounce.ts`

---

## API

- `{domain}-api.ts`

예시:

- `analysis-fields-api.ts`
- `auth-api.ts`

---

## Types

- `{domain}.types.ts`
- 필요 시 `{subdomain}.types.ts`

예시:

- `v2v.types.ts`
- `analysis-field.types.ts`
- `date-range.types.ts`

---

## Constants / Utils

- `{domain}.constants.ts`
- `{domain}.ts`

예시:

- `date-range.constants.ts`
- `date-range.ts`
