# V2V 기능 가이드

현재 `v2v` 기능의 실제 구조와 앞으로의 확장 방향을 정리한 문서다.

---

## 현재 구조

```txt
src/
├─ pages/
│  └─ v2v/
│     └─ v2v-page.vue
├─ features/
│  └─ v2v/
│     ├─ api/
│     │  ├─ analysis-fields-api.ts
│     │  └─ analysis-fields.mock.json
│     ├─ controllers/
│     │  ├─ use-analysis-fields.controller.ts
│     │  └─ use-v2v-download.controller.ts
│     ├─ lib/
│     │  └─ analysis-fields-mapper.ts
│     └─ types/
│        ├─ analysis-field.types.ts
│        └─ v2v.types.ts
└─ shared/
   ├─ components/
   ├─ composables/
   ├─ constants/
   ├─ i18n/
   ├─ types/
   └─ utils/
```

---

## 현재 화면 역할

### `pages/v2v/v2v-page.vue`

- 현재 `v2v` 화면 entry page
- 검색 입력, 결과 리스트, 상세 패널, 다운로드 모달을 한 화면에서 조합
- 향후에는 page shell 역할만 남기고 화면 상태는 feature controller 로 더 이동시키는 것이 목표

### `features/v2v/controllers/use-analysis-fields.controller.ts`

- Vue Query 기반 분석 필드 조회
- API 응답을 i18n 과 결합해 화면용 구조로 변환

### `features/v2v/controllers/use-v2v-download.controller.ts`

- 다운로드 모달 open/close
- 그룹별 선택 상태 관리
- localStorage 저장/복원
- 다운로드 가능 여부 계산

### `features/v2v/lib/analysis-fields-mapper.ts`

- API 응답을 화면용 필드 모델로 매핑

---

## 현재 설계 원칙

- 분석 필드 목록은 서버 상태로 보고 Vue Query 로 조회한다.
- 다운로드 모달 상태와 체크 상태는 controller 내부 로컬 상태로 관리한다.
- 다국어 라벨은 `shared/i18n/locales/analysis-fields.*.json` 에서 관리한다.
- 날짜 범위 선택은 `shared/composables/use-date-range-filter.controller.ts` 를 통해 관리한다.

---

## To-Be 방향

기능이 커질 경우 아래 구조로 확장한다.

```txt
src/features/v2v/
├─ api/
├─ components/
│  ├─ v2v-screen.vue
│  ├─ v2v-search-bar.vue
│  ├─ v2v-result-list.vue
│  └─ v2v-detail-panel.vue
├─ controllers/
│  ├─ use-v2v-page.controller.ts
│  ├─ use-analysis-fields.controller.ts
│  └─ use-v2v-download.controller.ts
├─ lib/
└─ types/
```

확장 원칙:

- `v2v-page.vue` 는 라우트 entry 와 feature screen 조합만 담당
- 검색어, 선택 상태, 결과 목록 상태는 `use-v2v-page.controller.ts` 로 이동
- 표현 UI 는 `features/v2v/components/` 로 이동
- 다운로드 payload 조합이 복잡해지면 `lib/` 로 분리

---

## 라우팅

- `v2v` 페이지는 `src/app/router/v2v.routes.ts` 에 등록한다.
- 현재 기본 경로 `/` 는 `v2v-page.vue` 로 연결된다.
- 추가 페이지가 생기면 `v2v.routes.ts` 에 함께 등록한다.

---

## 리뷰 시 확인할 점

- page 가 feature entry 역할을 넘어서고 있지 않은가
- 서버 상태와 로컬 화면 상태가 섞이지 않았는가
- 공용 코드가 아닌데 `shared/` 로 과하게 올라가 있지 않은가
- 다운로드, 검색, 선택 흐름이 controller 로 충분히 분리되었는가
