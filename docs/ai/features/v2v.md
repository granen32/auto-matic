# V2V 기능 가이드

V2V 화면의 흐름과 구현 기준을 정리한 문서다.

---

## 화면 흐름

현재 V2V 화면은 다음 흐름을 중심으로 설계한다.

1. 상단 검색 바에서 키워드 검색
2. 검색 결과와 함께 필터 목록을 응답으로 받음
3. 좌측에서 결과 리스트 탐색
4. 우측에서 선택 상세 확인
5. 다운로드 버튼 클릭 시 모달 오픈
6. 모달에서 분석 필드 그룹(일반/고급) 중 다운로드할 키워드 선택
7. Excel 다운로드 실행

---

## 설계 원칙

- 검색 조건과 결과 조회는 **React Query 기반**으로 설계한다.
- 응답 기반 필터 목록은 **검색 응답 모델의 일부**로 본다.
- 다운로드 모달 상태는 전역 store보다 **controller 내부 상태**를 우선한다.
- 좌측 결과 목록과 우측 상세 패널은 하나의 page controller 또는 v2v feature controller가 orchestration 한다.
- Excel 다운로드는 별도 API 함수로 분리하고, 선택된 분석 필드를 합쳐 request payload를 만든다.
- 결과 목록 UI는 Data Table 또는 AG Grid 중 화면 복잡도에 따라 선택한다.
- 상세 패널은 표현 컴포넌트로 유지하고, 선택 상태와 파생 데이터는 controller가 관리한다.
- 분석 필드의 표시 텍스트는 다국어 사전(`shared/i18n/locales/analysis-fields.{ko,en}.json`)에서 가져온다. API는 키 + label만 내려준다.

---

## 권장 폴더 구조

```txt
src/
├─ pages/
│  └─ v2v/
│     └─ v2v-page.vue
│
├─ features/
│  └─ v2v/
│     ├─ api/
│     │  ├─ v2v-api.ts
│     │  └─ analysis-fields-api.ts
│     ├─ components/
│     │  ├─ v2v-search-bar.vue
│     │  ├─ v2v-result-table.vue
│     │  ├─ v2v-detail-panel.vue
│     │  └─ v2v-filter-chip-list.vue
│     ├─ controllers/
│     │  ├─ use-v2v-page.controller.ts
│     │  ├─ use-v2v-search.controller.ts
│     │  ├─ use-v2v-download.controller.ts
│     │  └─ use-analysis-fields.controller.ts
│     ├─ stores/
│     │  └─ v2v.store.ts
│     ├─ types/
│     │  ├─ v2v.types.ts
│     │  └─ analysis-field.types.ts
│     └─ lib/
│        └─ v2v-export-payload.ts
│
└─ shared/
   ├─ components/
   │  ├─ base-modal.vue
   │  └─ download-modal.vue
   └─ i18n/
      ├─ use-i18n.ts
      └─ locales/
         ├─ analysis-fields.ko.json
         ├─ analysis-fields.en.json
         ├─ common.ko.json
         └─ common.en.json
```

---

## 레이어별 책임

### `v2v-page.vue`
- 페이지 셸
- 검색 영역 + 결과 영역 + 상세 영역 배치
- feature 컴포넌트 조합

### `use-v2v-page.controller.ts`
- 검색어 상태
- 선택된 결과 상태
- 활성 필터 상태
- 상세 패널에 내려줄 view model 계산
- 다운로드 모달 열림 상태
- list / detail / download 흐름 연결

### `use-v2v-download.controller.ts`
- `useAnalysisFieldsController()`로 필드 목록 조회
- 그룹별(일반/고급) 선택 상태 (`Set<string>`) 관리
- localStorage에 마지막 선택 저장 / 복원
- 모달에 전달할 `groups`, `activeGroupId`, `isDownloadable` 노출
- `toggleField`, `toggleAll`, `changeGroup`, `handleDownload` 노출

### `use-analysis-fields.controller.ts`
- React Query로 분석 필드 목록 fetch
- i18n 사전과 머지하여 `LocalizedAnalysisField[]` 반환
- locale 변경 시 자동 재계산

### `v2v-api.ts`
- `searchPenot()`
- `downloadPenotExcel()`
- 응답 mapper
- request payload 타입 정의

### `analysis-fields-api.ts`
- `fetchAnalysisFields()` — `{ generalAnalysisFields, advancedAnalysisFieldsPartial }` 반환
- 각 항목은 `{ key, label }` 형태

### `v2v-result-table.vue`
- 결과 목록 렌더링
- row click emit
- loading / empty state 표시

### `v2v-detail-panel.vue`
- 선택된 항목 상세 렌더링
- 설명 / 메타데이터 표시

### `download-modal.vue` (shared)
- 일반 분석 / 고급 분석 탭
- 키워드 그리드 (이름 + 설명)
- 검색창 + 카운트 + 전체 선택
- 모든 라벨 i18n 적용
- 선택 / 전체선택 / 다운로드는 emit으로 controller에 위임

---

## 다국어 (i18n)

- 분석 필드는 API에서는 `{ key, label }`만 내려오고, 화면 표시에 사용할 `name` / `description`은 `shared/i18n/locales/analysis-fields.{ko,en}.json`에서 가져온다.
- locale 전환은 `useI18n().setLocale('ko' | 'en')`로 처리하며, 값은 `localStorage`에 저장된다.
- 사전에 키가 없으면 API의 `label`을 fallback으로 사용한다.

---

## 다운로드 payload

- controller에서 `{ general: string[], advanced: string[] }` 형태로 선택된 키 목록을 만든다.
- `lib/v2v-export-payload.ts`에서 검색 조건과 합쳐 최종 request payload로 변환한다.
- API 함수는 payload만 받아서 호출한다.

---

## 확장 포인트

- 분석 필드 그룹이 늘어날 가능성이 있으면, `groups`를 컨트롤러에서 동적으로 만들 수 있도록 설계한다 (지금은 general/advanced 두 개 고정).
- 다운로드 양식이 Excel 외에 추가될 가능성이 있으면, payload 생성과 API 호출을 분리해 둔다.
- 분석 필드의 i18n 사전이 커지면 lazy import로 분리할 수 있다.
