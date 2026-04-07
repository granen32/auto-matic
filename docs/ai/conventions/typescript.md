# TypeScript 규칙

---

## 기본 원칙

- 도메인 타입은 feature 가까이에 둔다 (`features/{feature}/types/`).
- API 응답 타입과 UI view model 타입은 필요 시 분리한다.
- controller 반환값은 명시적 타입을 우선한다.
- `any` 사용은 지양한다. 외부 데이터를 다루어야 한다면 `unknown`을 거쳐 좁힌다.
- AG Grid / Data Table column 정의도 가능한 한 타입을 명확히 한다.

---

## interface vs type

- 객체 형태는 `interface`를 우선 사용한다.
- 유니온 / 매핑 / conditional 등 유연한 표현이 필요하면 `type`을 사용한다.
- export 시 둘 중 어느 쪽이든 일관성 있게 사용한다.

```ts
export interface V2vResultItem {
  id: string
  title: string
  summary: string
}

export type AnalysisFieldGroup = 'general' | 'advanced'
```

---

## API 응답 vs view model

서버 응답 그대로를 화면에서 사용하지 않는다. api 계층에서 view model로 변환한다.

```ts
// api raw
export interface AnalysisFieldRaw {
  key: string
  label: string
}

// view model
export interface LocalizedAnalysisField {
  key: string
  name: string
  description: string
  checked: boolean
}
```

---

## controller 반환 타입

controller는 외부에서 사용하는 모양이 명확해야 한다. 가능하면 반환값에 명시 타입을 붙인다.

```ts
export interface UseV2vDownloadController {
  isModalOpen: Ref<boolean>
  groups: ComputedRef<DownloadFieldGroup[]>
  openModal: () => void
  closeModal: () => void
  handleDownload: () => void
}

export function useV2vDownloadController(): UseV2vDownloadController { /* ... */ }
```

inference만으로 충분히 안정적인 경우는 생략 가능하지만, public API 성격이면 명시한다.

---

## any / unknown / 타입 단언

- `any`는 사용하지 않는다.
- 외부 데이터(예: `JSON.parse`, `localStorage`)는 `unknown`으로 받고 type guard 또는 zod 같은 검증을 거쳐 좁힌다.
- 단언(`as`)은 정말 필요한 경우에만 쓰고, 이유를 주석으로 남긴다.

```ts
function loadSavedSelection(): StoredSelection {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object') {
      return parsed as StoredSelection
    }
  } catch {
    /* noop */
  }
  return {}
}
```

---

## generic

- 진짜로 재사용 가능성이 있을 때만 generic을 도입한다.
- 한 곳에서만 쓰는 코드에 미리 generic을 끼우지 않는다.

---

## strict 옵션

- 가능하면 `strict: true` 옵션을 유지한다.
- `noImplicitAny`, `strictNullChecks` 등을 끄지 않는다.
