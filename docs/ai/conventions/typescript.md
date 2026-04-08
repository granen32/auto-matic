# TypeScript 규칙

---

## 기본 원칙

- 도메인 타입은 feature 가까이에 둔다.
- 공용 타입은 `shared/types/` 에 둔다.
- API 응답 타입과 UI view model 타입은 필요 시 분리한다.
- controller 반환값은 외부에 노출되는 경우 명확한 shape 를 유지한다.
- `any` 사용은 지양한다.

---

## 현재 구조 기준 예시

- `features/v2v/types/analysis-field.types.ts`
- `features/v2v/types/v2v.types.ts`
- `shared/types/date-range.types.ts`
- `shared/types/download-field.types.ts`

---

## API 응답 vs view model

서버 응답 그대로를 화면 전체에서 직접 사용하지 않는다.
가능하면 `api` 계층 또는 `lib` mapper 에서 화면용 구조로 정제한다.

예시:

```ts
export interface AnalysisFieldRaw {
  key: string
  label: string
}

export interface LocalizedAnalysisField {
  key: string
  name: string
  description: string
  checked: boolean
}
```

---

## 외부 데이터 다루기

- `JSON.parse`, `localStorage`, 외부 응답 등은 곧바로 신뢰하지 않는다.
- `unknown` 기반으로 좁히거나 최소한 형태 검사를 거친다.
- `as` 단언은 필요한 범위에서만 사용한다.

---

## 타입 설계 원칙

- 한 곳에서만 쓰는 과도한 generic 은 만들지 않는다.
- nullable 상태는 타입으로 분명하게 드러낸다.
- union string literal 은 도메인 상태 표현에 적극 사용한다.
