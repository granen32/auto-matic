# React Query / Pinia 역할 분리

이 프로젝트의 상태는 크게 세 곳에서 관리한다.

1. **React Query** — 서버 상태
2. **Pinia** — 컴포넌트 경계를 넘는 클라이언트 공유 상태
3. **controller 내부 ref / computed** — 한 화면 안에서만 잠깐 쓰는 상태

---

## React Query

주로 **서버 상태**를 담당한다.

- 목록 조회
- 상세 조회
- 검색 결과 조회
- 다운로드용 서버 요청
- 캐싱 / stale 관리
- refetch / retry

규칙:

- query key는 입력 조건(검색어, 필터 등)을 기준으로 안정적으로 구성한다.
- 서버 응답 타입은 가능하면 api 계층에서 view model로 변환한다.
- mutation 결과는 query invalidation으로 동기화한다.

---

## Pinia

**클라이언트 공유 상태**를 담당한다.

- 사용자 세션
- 권한 정보
- 공통 필터 유지값
- 전역 UI 설정 (테마, 언어, 사이드바 열림 등)
- 여러 feature 간 공유해야 하는 상태

규칙:

- store에 서버 응답을 그대로 캐싱하지 않는다. 그건 React Query의 책임이다.
- 페이지 한정 상태를 store에 올리지 않는다.

---

## controller 내부 상태

- 한 페이지/한 모달 안에서만 잠깐 쓰는 값은 controller 안의 `ref` / `reactive` / `computed`로 둔다.
- 컴포넌트 사이를 넘어가야 할 때만 store나 query로 끌어올린다.

---

## 원칙 요약

- **서버에서 가져오는 데이터 → React Query 우선**
- **컴포넌트 경계를 넘는 클라이언트 상태 → Pinia**
- **한 페이지 안에서만 잠깐 쓰는 상태 → controller 내부 ref / computed 우선**

---

## 판단 흐름

새 상태가 생겼을 때 다음 순서로 위치를 정한다.

1. 이 값은 서버에서 오는가? → React Query
2. 여러 페이지 / feature가 이 값을 공유해야 하는가? → Pinia
3. 그 외 → controller 내부 ref / computed
