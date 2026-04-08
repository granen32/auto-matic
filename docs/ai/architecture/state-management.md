# 상태 관리 가이드

현재 프로젝트의 상태는 크게 세 곳에서 관리한다.

1. `@tanstack/vue-query` - 서버 상태
2. Pinia - 컴포넌트 경계를 넘는 클라이언트 공유 상태
3. controller 내부 `ref / reactive / computed` - 화면 로컬 상태

---

## Vue Query

주로 서버 상태를 담당한다.

- 목록 조회
- 상세 조회
- 서버 기반 필드 목록 조회
- 캐싱 / stale 관리
- refetch / retry

규칙:

- query key 는 입력 조건 기준으로 안정적으로 구성한다.
- 응답은 가능하면 `api` 계층 또는 `lib` mapper 에서 화면용 구조로 정제한다.
- 서버 응답을 Pinia 에 중복 캐싱하지 않는다.

현재 예시:

- `features/v2v/controllers/use-analysis-fields.controller.ts`

---

## Pinia

클라이언트 공유 상태를 담당한다.

현재 프로젝트는 아직 전역 store 사용이 크지 않다.
Pinia 는 필요가 생겼을 때만 도입한다.

적합한 예:

- 사용자 정보
- 권한 상태
- 앱 공통 설정
- 여러 페이지에서 유지해야 하는 공통 필터

부적합한 예:

- `v2v` 페이지 내부 검색어
- 다운로드 모달 open/close
- 선택된 결과 항목

---

## Controller 내부 상태

한 페이지 또는 한 feature 화면 안에서만 잠깐 쓰는 값은 controller 안의 상태로 둔다.

예:

- 검색어
- 선택된 항목 ID
- 적용된 날짜 범위
- 다운로드 모달 열림 여부
- 모달 내 체크 상태

현재 예시:

- `features/v2v/controllers/use-v2v-download.controller.ts`
- `shared/composables/use-date-range-filter.controller.ts`

---

## 판단 기준

새 상태가 생기면 아래 순서로 판단한다.

1. 서버에서 가져오는 값인가?
   - Vue Query
2. 여러 화면 또는 feature 가 공유해야 하는가?
   - Pinia
3. 그 외인가?
   - controller 내부 상태
