# CLAUDE.md

## 목적
이 문서는 아이티센 프론트엔드 프로젝트에서 Claude 또는 유사한 AI 코딩 어시스턴트가 코드 생성, 리팩토링, 구조 제안, 리뷰를 수행할 때 따라야 할 아키텍처 및 구현 가이드를 정리한 문서이다.

이 프로젝트의 기본 원칙은 다음 두 자료를 따른다.

- FE 아키텍처 가이드 (`fe.md`)
- 현재 합의된 V2V 화면/플로우 방향 (`v2v_design_page.html`)

---

## 프로젝트 기준 스택

- Vue 3
- TypeScript
- Pinia
- React Query
- Data Table
- AG Grid
- D3
- Tailwind CSS
- ESLint
- Prettier
- Vite 우선

---

## 가장 중요한 원칙

1. **화면 표현과 비즈니스 로직을 분리한다.**
2. **파일 및 폴더 이름은 모두 kebab-case를 사용한다.**
3. **비즈니스 흐름을 담당하는 composable은 `.controller.ts`를 사용한다.**
4. **Feature-first 구조를 우선한다.**
5. **Pinia는 공유 상태에만 사용한다.**
6. **React Query는 서버 상태 조회/캐싱에 우선 사용한다.**
7. **D3 로직은 Vue SFC 내부에 길게 작성하지 않고 renderer로 분리한다.**
8. **템플릿에는 복잡한 조건문과 비즈니스 계산을 넣지 않는다.**
9. **API 응답 원본을 UI 전역에 직접 퍼뜨리지 말고 API 계층 근처에서 정제한다.**
10. **페이지는 진입점, feature는 실제 기능 구현 위치로 본다.**

---

## Claude 응답 기본 규칙

Claude는 이 프로젝트 관련 질문에 대해 아래 규칙을 기본으로 적용해야 한다.

- 모든 예시는 **Vue 3 + TypeScript + script setup** 기준으로 작성한다.
- 상태 설계는 **Pinia + React Query 역할 분리**를 전제로 설명한다.
- 폴더 구조 제안은 **feature-first**를 기준으로 한다.
- 비즈니스 로직 제안 시 우선적으로 `use-*.controller.ts` 구조를 사용한다.
- D3가 포함된 화면은 반드시 **component / controller / renderer 분리**를 고려한다.
- 공용 모듈은 `shared/`로, feature 전용 모듈은 해당 feature 내부에 둔다.
- 새 예시를 만들 때 파일명은 모두 **kebab-case**로 작성한다.
- 단순 유틸성 composable에는 `.controller.ts`를 붙이지 않는다.
- Vue 컴포넌트는 가급적 **props / emits / rendering 중심**으로 유지한다.
- 답변 시 "현재 구조에서 바로 적용 가능한 방식"을 우선 제안한다.

---

## 네이밍 규칙

### 파일 / 폴더
- 모두 kebab-case
- camelCase, PascalCase 파일명 지양

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

### Vue 컴포넌트
- 파일명: kebab-case
- 컴포넌트명: 코드 내부에서 PascalCase 가능

예시:
- 파일명: `user-profile-card.vue`
- 컴포넌트명: `UserProfileCard`

### controller composable
비즈니스 흐름을 포함하면 `.controller.ts`를 사용한다.

패턴:
- `use-{domain}.controller.ts`
- `use-{feature}-{action}.controller.ts`

예시:
- `use-login.controller.ts`
- `use-dashboard-filter.controller.ts`
- `use-sales-chart.controller.ts`

### 일반 composable
범용 UI 보조/유틸은 `.controller.ts`를 붙이지 않는다.

예시:
- `use-debounce.ts`
- `use-resize-observer.ts`
- `use-scroll-lock.ts`

### store
- `{domain}.store.ts`

예시:
- `auth.store.ts`
- `dashboard.store.ts`
- `user-preference.store.ts`

### api
- `{domain}-api.ts`

예시:
- `auth-api.ts`
- `report-api.ts`
- `user-api.ts`

---

## 권장 폴더 구조

```txt
src/
├─ app/
│  ├─ providers/
│  ├─ router/
│  └─ stores/
│
├─ pages/
│  ├─ auth/
│  │  └─ login-page.vue
│  ├─ dashboard/
│  │  └─ dashboard-page.vue
│  └─ v2v/
│     └─ v2v-page.vue
│
├─ features/
│  ├─ auth/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ controllers/
│  │  ├─ stores/
│  │  └─ types/
│  │
│  ├─ dashboard/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ controllers/
│  │  ├─ lib/
│  │  ├─ stores/
│  │  └─ types/
│  │
│  └─ v2v/
│     ├─ api/
│     ├─ components/
│     ├─ controllers/
│     ├─ stores/
│     ├─ lib/
│     └─ types/
│
└─ shared/
   ├─ api/
   ├─ components/
   ├─ composables/
   ├─ constants/
   ├─ types/
   └─ utils/
```

---

## 레이어 역할 정의

### 1) pages
페이지 진입점만 담당한다.

해야 하는 일:
- 라우트 진입
- feature 컴포넌트 조립
- 페이지 레벨 레이아웃 배치

하지 말아야 하는 일:
- API 직접 호출
- 복잡한 필터 조합
- 차트 데이터 가공
- 다운로드 정책 처리

### 2) features
실제 비즈니스 기능 구현 위치다.

feature 내부에는 가능하면 아래를 함께 둔다.
- `api/`
- `components/`
- `controllers/`
- `stores/`
- `types/`
- `lib/` (D3 renderer 등)

### 3) components
표현 중심이어야 한다.

포함 가능:
- props / emits
- 마크업
- 기본 UI 상태 표시
- 테이블/그리드 렌더링
- 차트 컨테이너

지양:
- API orchestration
- 복잡한 파생 상태
- store / router / query 다중 연결
- 다운로드/검색 정책 판단

### 4) controllers
UI와 domain resource 사이의 orchestration layer다.

포함 가능:
- API 호출 순서 제어
- submit handling
- 필터 상태 조합
- store / query / router 연결
- 복잡한 computed 상태
- 에러 / 로딩 / 재시도 상태 처리
- D3용 데이터 가공
- 컴포넌트 이벤트 오케스트레이션

포함하면 안 되는 것:
- 정적 마크업
- 스타일링
- 너무 범용적인 순수 유틸
- D3 draw / axis / transition 내부 구현

### 5) api
백엔드 통신과 응답 정제를 담당한다.

규칙:
- 서버 응답 타입과 UI view model 타입이 다르면 이 계층 근처에서 변환한다.
- 원본 응답 필드명을 UI 전역에 그대로 노출하지 않는다.
- fetcher / request / mapper를 이 레이어 주변에 둔다.

### 6) stores
Pinia는 공유 상태에만 사용한다.

store로 올릴 수 있는 것:
- 로그인 사용자 정보
- 권한 정보
- 앱 전역 설정
- 여러 feature/page가 공유하는 상태

store로 올리지 않는 것:
- 페이지 단위 임시 검색어
- 모달 열림 여부
- 일회성 로딩 상태
- 특정 화면 내부 선택 row
- 차트 hover 상태

### 7) lib
렌더러, 옵션 빌더, 어댑터 등 feature 내부 저수준 로직을 둔다.

예시:
- `sales-chart-renderer.ts`
- `sales-chart-options.ts`

---

## React Query / Pinia 역할 분리

### React Query
주로 서버 상태를 담당한다.
- 목록 조회
- 상세 조회
- 검색 결과 조회
- 다운로드용 서버 요청
- 캐싱 / stale 관리
- refetch / retry

### Pinia
클라이언트 공유 상태를 담당한다.
- 사용자 세션
- 공통 필터 유지값
- 전역 UI 설정
- 여러 feature 간 공유해야 하는 상태

### 원칙
- **서버에서 가져오는 데이터는 React Query 우선**
- **컴포넌트 경계를 넘는 클라이언트 상태는 Pinia**
- **한 페이지 안에서만 잠깐 쓰는 상태는 controller 내부 refs/computed 우선**

---

## D3 작성 규칙

D3는 반드시 분리한다.

권장 흐름:
1. API 또는 store에서 데이터 조회
2. controller에서 차트용 데이터로 가공
3. component에서 `ref`와 lifecycle 관리
4. renderer에서 draw / update / cleanup 수행

권장 파일 구조:
- `sales-chart.vue`
- `use-sales-chart.controller.ts`
- `sales-chart-renderer.ts`
- `sales-chart.types.ts`

규칙:
- Vue SFC 내부에 긴 D3 selection 체인을 작성하지 않는다.
- D3는 렌더링, 스케일, axis, transition에 집중한다.
- Vue는 props, ref, watch, lifecycle을 담당한다.

---

## TypeScript 규칙

- 도메인 타입은 feature 가까이에 둔다.
- API 응답 타입과 UI view model 타입은 필요 시 분리한다.
- controller 반환값은 명시적 타입을 우선한다.
- any 사용은 지양한다.
- AG Grid / Data Table column 정의도 가능한 한 타입을 명확히 한다.

예시 파일:
- `dashboard.types.ts`
- `v2v.types.ts`
- `chart.types.ts`

---

## V2V 기능에 대한 해석 기준

현재 V2V 화면은 다음 흐름을 중심으로 설계한다.

1. 상단 검색 바에서 키워드 검색
2. 검색 결과와 함께 필터 목록을 응답으로 받음
3. 좌측에서 결과 리스트 탐색
4. 우측에서 선택 상세 확인
5. 다운로드 버튼 클릭 시 모달 오픈
6. 모달에서 기본 필터 + 커스텀 필터 조합
7. Excel 다운로드 실행

따라서 Claude는 V2V 관련 기능 제안 시 아래 원칙을 따른다.

- 검색 조건과 결과 조회는 **React Query 기반**으로 설계한다.
- 응답 기반 필터 목록은 **검색 응답 모델의 일부**로 본다.
- 다운로드 모달 상태는 전역 store보다 **controller 내부 상태**를 우선한다.
- 좌측 결과 목록과 우측 상세 패널은 하나의 page controller 또는 v2v feature controller가 orchestration 한다.
- Excel 다운로드는 별도 API 함수로 분리하고, 선택된 기본 필터 + 사용자 커스텀 필터를 합쳐 request payload를 만든다.
- 결과 목록 UI는 Data Table 또는 AG Grid 중 화면 복잡도에 따라 선택한다.
- 상세 패널은 표현 컴포넌트로 유지하고, 선택 상태와 파생 데이터는 controller가 관리한다.

---

## V2V 권장 구조 예시

```txt
src/
├─ pages/
│  └─ v2v/
│     └─ v2v-page.vue
│
├─ features/
│  └─ v2v/
│     ├─ api/
│     │  └─ v2v-api.ts
│     ├─ components/
│     │  ├─ v2v-search-bar.vue
│     │  ├─ v2v-result-table.vue
│     │  ├─ v2v-detail-panel.vue
│     │  ├─ v2v-download-modal.vue
│     │  └─ v2v-filter-chip-list.vue
│     ├─ controllers/
│     │  ├─ use-v2v-page.controller.ts
│     │  ├─ use-v2v-search.controller.ts
│     │  └─ use-v2v-download.controller.ts
│     ├─ stores/
│     │  └─ v2v.store.ts
│     ├─ types/
│     │  └─ v2v.types.ts
│     └─ lib/
│        └─ v2v-export-payload.ts
│
└─ shared/
   ├─ api/
   ├─ components/
   └─ utils/
```

---

## V2V 레이어별 책임 예시

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
- list/detail/download 흐름 연결

### `v2v-api.ts`
- `searchPenot()`
- `downloadPenotExcel()`
- 응답 mapper
- request payload 타입 정의

### `v2v-result-table.vue`
- 결과 목록 렌더링
- row click emit
- loading / empty state 표시

### `v2v-detail-panel.vue`
- 선택된 항목 상세 렌더링
- 설명 / 메타데이터 표시

### `v2v-download-modal.vue`
- 기본 필터 체크 UI
- 커스텀 필터 입력 UI
- confirm / cancel emit

---

## 구현할 때 Claude가 우선 제안해야 하는 패턴

### 검색 화면
- 검색 상태는 controller 내부 ref
- 조회는 React Query
- query key는 검색 조건 기준으로 안정적으로 구성
- 입력 디바운스 필요 시 `shared/composables/use-debounce.ts`

### 테이블 / 그리드
- 단순 목록: Data Table 우선
- 컬럼 커스터마이징, 가상화, 고급 기능 필요: AG Grid 고려
- 컬럼 정의는 feature 내부 `types` 또는 `constants` 근처에서 관리

### 모달
- 전역 모달 store 남용 금지
- 화면 한정 모달은 page controller 또는 feature controller 내부 상태로 처리

### 다운로드
- controller에서 payload 조합
- api에서 실제 요청
- 버튼 disabled, loading, validation 상태를 명확히 분리

### 상세 패널
- 목록 선택 상태는 controller가 관리
- 패널은 전달받은 view model만 렌더링

---

## Claude가 피해야 하는 제안

다음과 같은 제안은 기본적으로 피한다.

- 모든 상태를 Pinia에 넣는 구조
- 하나의 `.vue` 파일에서 API, 필터, 다운로드, 상세 패널, 그리드 제어를 전부 처리하는 구조
- D3를 컴포넌트 내부에 직접 길게 그리는 구조
- 파일명을 PascalCase로 만드는 구조
- feature보다 `components/`, `apis/`, `stores/` 전역 분리를 우선하는 구조
- 서버 응답 원본을 그대로 template에서 직접 사용하는 구조
- 단순 유틸 composable까지 전부 `.controller.ts`로 만드는 방식

---

## 코드 생성 시 선호 포맷

Claude는 코드 예시를 제시할 때 아래 형식을 우선한다.

- Vue SFC는 `<script setup lang="ts">`
- composable은 함수형 export
- 타입은 `type` 또는 `interface`를 명확히 표기
- import path는 alias(`@/`) 기준 사용
- 예시는 실제 폴더 구조와 연결되도록 파일 경로를 함께 설명

---

## 리뷰 체크리스트

코드 리뷰나 구조 리뷰 시 아래 항목을 우선 체크한다.

- [ ] Vue 3 + TypeScript 기준인가
- [ ] 파일 / 폴더명이 kebab-case인가
- [ ] 비즈니스 composable이 `.controller.ts` 규칙을 따르는가
- [ ] feature-first 구조를 지키는가
- [ ] Pinia가 공유 상태에만 쓰였는가
- [ ] React Query가 서버 상태를 담당하는가
- [ ] API 응답 정제가 API 계층 근처에서 이루어지는가
- [ ] 템플릿에 복잡한 비즈니스 계산이 없는가
- [ ] D3 로직이 renderer로 분리되었는가
- [ ] page / component / controller 책임이 분리되었는가

---

## Claude에게 요청할 때의 기대 응답 방식

이 프로젝트에서 Claude는 가능하면 다음 순서로 답해야 한다.

1. 현재 구조에서의 권장안
2. 왜 그렇게 나누는지
3. 실제 폴더 구조 예시
4. 필요 시 간단한 코드 예시
5. 추후 확장 또는 마이그레이션 포인트

---

## 한 줄 요약

이 프로젝트에서 Claude는 **Vue 3 + TypeScript + Pinia + React Query + D3 + feature-first + controller 분리** 원칙을 기준으로, **page → feature component → controller → api/store/lib** 흐름에 맞춰 제안해야 한다.
