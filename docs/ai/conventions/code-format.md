# 코드 생성 시 선호 포맷

Claude가 코드 예시를 제시할 때 따라야 하는 형식이다.

---

## Vue SFC

- `<script setup lang="ts">` 사용
- `<template>` → `<script>` → `<style>` 순서를 지키되, script setup 컨벤션을 따른다.
- `defineProps`, `defineEmits`는 타입 인자 형태로 작성한다.
- `withDefaults`로 기본값을 명확히 한다.

```vue
<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '720px',
})

const emit = defineEmits<{
  close: []
}>()
</script>
```

---

## Composable

- 함수형 export
- 반환값은 객체 리터럴로 명시적으로 묶어 반환한다.
- 외부에서 쓰는 모양이 명확하게 보이도록 한다.

```ts
export function useV2vDownloadController() {
  // ... 내부 상태와 함수

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleDownload,
  }
}
```

---

## 타입

- `type` 또는 `interface`를 명확히 표기
- 응답 타입과 view model 타입을 분리할 때 이름으로 구분이 가도록 한다 (`...Raw`, `Localized...` 등).

---

## import

- alias는 `@/` 사용 (`tsconfig.app.json`에 정의됨).
- 외부 패키지 → alias 경로 → 상대 경로 순으로 묶는다.
- 같은 그룹 내에서는 알파벳 순.

```ts
import { computed, ref } from 'vue'

import BaseModal from '@/shared/components/base-modal.vue'
import { useI18n } from '@/shared/i18n/use-i18n'

import type { LocalizedAnalysisField } from '../types/analysis-field.types'
```

---

## 주석

- 코드를 그대로 풀어 쓰는 주석은 쓰지 않는다.
- "왜 이렇게 했는지"가 자명하지 않을 때만 주석을 단다.
- TODO에는 가능하면 다음 액션을 적는다 (`// TODO: 다운로드 API 연결`).

---

## 답변 시 코드 예시 포함 규칙

- 예시는 실제 폴더 구조와 연결되도록 **파일 경로를 함께 설명**한다.
- 한 답변에서 너무 긴 SFC를 통째로 쏟아내지 않는다. 필요한 부분만 잘라서 보인다.
- props/emits, controller, api 등 레이어가 여러 개 걸쳐 있으면 **각 파일 단위로 잘라서 보인다.**
