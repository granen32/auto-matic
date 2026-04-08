# V2V 리팩토링 제안

## 문서 목적

이 문서는 현재 `docs/ai` 기준과 실제 프로젝트 구조를 바탕으로 `v2v` 화면 리팩토링 방향을 정리한 제안서다.
Jira 이슈 설명과 Confluence 공유 문서로 바로 사용할 수 있는 수준을 목표로 한다.

기준 문서:

- `docs/ai/CLAUDE.md`
- `docs/ai/architecture/folder-structure.md`
- `docs/ai/architecture/layer-roles.md`
- `docs/ai/architecture/state-management.md`
- `docs/ai/architecture/routing.md`
- `docs/ai/features/v2v.md`

---

## 1. 요약

현재 프로젝트는 `feature-first` 구조를 이미 따르고 있으며, `vue-router` 기반 라우팅 구조와 `v2v` feature 중심 설계가 잡혀 있다.

다만 현재 `v2v-page.vue` 에 화면 상태, 임시 데이터, 이벤트 핸들러가 남아 있어 `docs/ai` 기준의 `page = 진입점`, `controller = orchestration layer` 원칙과 완전히 일치하지는 않는다.

이번 리팩토링의 목적은 아래와 같다.

- `v2v-page.vue` 를 entry page 역할로 축소
- `v2v` 화면 흐름을 feature controller 중심으로 이동
- 표현 UI 를 feature components 로 분리
- 서버 상태, 로컬 화면 상태, 공용 상태의 경계를 명확히 유지

---

## 2. 현재 구조

현재 확인된 구조는 아래와 같다.

```txt
src/
├─ app/
│  ├─ app.vue
│  └─ router/
│     ├─ index.ts
│     ├─ routes.ts
│     └─ v2v.routes.ts
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

현재 구조의 장점:

- `app / pages / features / shared` 레이어가 이미 분리되어 있음
- 라우팅이 `src/app/router/*.routes.ts` 구조로 정리되어 있음
- 분석 필드 조회가 Vue Query 기반 controller 로 분리되어 있음
- 다운로드 선택 흐름이 별도 controller 로 분리되어 있음
- 날짜 범위, i18n, 공용 모달이 `shared` 에 정리되어 있음

---

## 3. 현재 문제

### 3.1 page 책임 과다

`pages/v2v/v2v-page.vue` 가 라우트 진입점 역할을 넘어서 아래까지 직접 들고 있다.

- 검색어 상태
- 선택 상태
- 결과 mock 데이터
- 화면 이벤트 핸들러

이 구조는 `docs/ai/architecture/layer-roles.md` 의 기준과 어긋난다.

### 3.2 feature 응집도 부족

다운로드 흐름은 `features/v2v/controllers/` 로 분리되어 있지만, 검색/리스트/상세 패널 흐름은 아직 page 내부에 남아 있다.

### 3.3 components 레이어 부재

현재 `features/v2v/components/` 가 없어, 화면 조합 UI 가 page 내부에 직접 들어가 있다.
기능이 커질수록 재사용성과 유지보수성이 떨어질 수 있다.

### 3.4 상태 관리 기준 혼선 가능성

현재는 비교적 단순하지만, 기능이 늘어나면 서버 상태와 화면 상태가 page 또는 store 로 섞일 가능성이 있다.

---

## 4. 리팩토링 목표

이번 리팩토링은 아래 목표를 기준으로 한다.

1. `v2v-page.vue` 는 route entry 와 feature screen 조합만 담당한다.
2. 검색, 선택, 결과 목록, 상세 패널 흐름은 feature controller 로 이동한다.
3. 표현 UI 는 `features/v2v/components/` 로 이동한다.
4. 서버 상태는 Vue Query, 화면 로컬 상태는 controller 내부 상태로 유지한다.
5. 라우팅은 기존 `vue-router` 구조를 유지한다.

---

## 5. To-Be 구조 제안

```txt
src/
├─ app/
│  └─ router/
│     ├─ index.ts
│     ├─ routes.ts
│     └─ v2v.routes.ts
├─ pages/
│  └─ v2v/
│     └─ v2v-page.vue
├─ features/
│  └─ v2v/
│     ├─ api/
│     │  ├─ analysis-fields-api.ts
│     │  └─ v2v-api.ts
│     ├─ components/
│     │  ├─ v2v-screen.vue
│     │  ├─ v2v-search-bar.vue
│     │  ├─ v2v-result-list.vue
│     │  └─ v2v-detail-panel.vue
│     ├─ controllers/
│     │  ├─ use-v2v-page.controller.ts
│     │  ├─ use-analysis-fields.controller.ts
│     │  └─ use-v2v-download.controller.ts
│     ├─ lib/
│     │  ├─ analysis-fields-mapper.ts
│     │  └─ v2v-export-payload.ts
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

## 6. 레이어별 역할 제안

### `pages/v2v/v2v-page.vue`

- 라우트 진입점
- `V2vScreen` 렌더링
- page shell 수준의 레이아웃만 유지

### `features/v2v/components/*`

- 검색 바
- 결과 리스트
- 상세 패널
- 전체 화면 조합 컴포넌트

표현 중심으로 유지하고, props / emits 기반으로 설계한다.

### `features/v2v/controllers/use-v2v-page.controller.ts`

- 검색어 상태
- 선택된 아이템 상태
- 검색 실행 흐름
- 날짜 범위 적용 흐름
- 결과 리스트와 상세 패널에 전달할 화면 상태 관리

### `features/v2v/controllers/use-v2v-download.controller.ts`

- 다운로드 모달 열림/닫힘
- 그룹별 체크 상태
- localStorage 저장/복원
- 다운로드 가능 여부 계산

### `features/v2v/api/*`

- 실제 API 호출
- mock 응답 관리
- 응답 타입 정제

### `features/v2v/lib/*`

- mapper
- export payload builder
- 기타 순수 로직

---

## 7. 상세 작업 범위

### 7.1 page 경량화

- `v2v-page.vue` 의 검색어, 결과 목록, 선택 상태를 page 밖으로 이동
- page 는 `v2v-screen.vue` 또는 동등한 feature 루트 컴포넌트를 렌더링하도록 변경

### 7.2 feature components 추가

- `features/v2v/components/` 생성
- 검색 바, 결과 리스트, 상세 패널, 화면 조합 컴포넌트 분리

### 7.3 page controller 추가

- `use-v2v-page.controller.ts` 추가
- 검색/선택/상세 흐름 orchestration 담당

### 7.4 mock 데이터 이동

- 현재 page 내부 mock 데이터는 feature 내부 mock 또는 `api` 계층으로 이동
- page 내부 임시 비즈니스 데이터 제거

### 7.5 API / payload 정리

- 실제 API 연동 시 `v2v-api.ts` 추가
- 응답 정제는 `api` 또는 `lib` 근처에서 처리
- 다운로드 payload 조합이 커지면 `v2v-export-payload.ts` 로 분리

---

## 8. Jira 등록용 초안

### 제목

`[V2V] 화면 구조 리팩토링 제안`

### 배경

현재 `v2v` 화면은 feature-first 구조와 `vue-router` 구조를 일부 잘 따르고 있으나, `pages/v2v/v2v-page.vue` 에 화면 상태와 임시 데이터가 남아 있어 page 책임이 과도하다. `docs/ai` 기준에 맞춰 page, feature, controller, shared 경계를 명확히 재정렬할 필요가 있다.

### 목적

- `v2v-page.vue` 를 entry page 수준으로 단순화
- 검색/리스트/상세/다운로드 흐름을 feature 내부로 집중
- 표현 UI 와 비즈니스 흐름 분리
- 상태 관리 기준 명확화

### 작업 항목

1. `features/v2v/components/` 구조 추가
2. `use-v2v-page.controller.ts` 추가
3. `v2v-page.vue` 의 로컬 상태와 이벤트 로직 이동
4. page 내부 mock 데이터 제거 및 feature 계층 이동
5. 필요 시 `v2v-api.ts`, `v2v-export-payload.ts` 추가
6. 리팩토링 후 `docs/ai` 기준과 정합성 점검

### 완료 조건

- `v2v-page.vue` 가 진입점 역할만 수행함
- 검색/선택/상세/다운로드 흐름이 controller 로 분리됨
- 표현 UI 가 feature components 로 이동됨
- 서버 상태와 로컬 화면 상태의 경계가 분명함

---

## 9. Confluence 등록용 초안

### 제목

V2V 리팩토링 제안

### 현황

현재 프로젝트는 `vue-router` 기반 라우팅과 `feature-first` 구조를 사용하고 있으며, `v2v` 기능은 `features/v2v` 아래에 `api`, `controllers`, `lib`, `types` 일부가 이미 분리되어 있다.

다만 `v2v-page.vue` 에 화면 상태와 임시 데이터가 남아 있어 page 와 feature 의 경계가 완전히 분리되어 있지 않다.

### 제안 내용

- page 는 route entry 와 feature 조합만 담당
- 화면 흐름은 `use-v2v-page.controller.ts` 로 이동
- 표현 UI 는 `features/v2v/components/` 로 분리
- 다운로드 흐름은 기존 `use-v2v-download.controller.ts` 를 유지하며 page 흐름과 연결
- API 응답 정제와 payload 생성은 component 밖에서 처리

### 기대 효과

- 파일 책임이 명확해짐
- 기능 확장 시 변경 지점이 예측 가능해짐
- 리뷰 기준이 `docs/ai` 문서와 일치함
- 문서와 실제 코드 구조의 차이가 줄어듦

---

## 10. 리스크 및 고려사항

- 현재 page 에 남아 있는 mock 데이터의 최종 소유 위치를 먼저 정해야 한다.
- 실제 검색 API 가 아직 연결되지 않은 상태라면 `use-v2v-page.controller.ts` 는 mock 기반으로 먼저 구성될 수 있다.
- `shared/` 로 이동할 항목은 실제 재사용성이 확인된 뒤에만 올리는 것이 적절하다.

---

## 11. 결론

이번 `v2v` 리팩토링은 단순 폴더 정리가 아니라, 현재 프로젝트가 이미 채택한 `vue-router + feature-first + controller 분리` 기준을 실제 화면 구조에 일관되게 적용하는 작업이다.

우선순위는 `page 경량화`, `feature components 추가`, `page controller 도입` 순으로 잡는 것이 적절하다.
