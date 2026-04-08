# 구현 패턴

현재 프로젝트에서 우선적으로 제안해야 하는 구현 패턴을 정리한다.

---

## 검색 화면

- 검색어, 선택 상태, 필터 입력은 controller 내부 `ref` 로 관리한다.
- 조회성 서버 데이터는 Vue Query 로 처리한다.
- query key 는 검색 조건 기준으로 안정적으로 구성한다.
- 검색 결과와 별개인 UI 상태는 store 로 올리지 않는다.

---

## 날짜 필터

- 날짜 범위 해석과 검증은 `shared/constants`, `shared/utils`, `shared/composables` 조합으로 둔다.
- 화면에서는 `use-date-range-filter.controller.ts` 를 통해 사용한다.
- 실제 검색 재호출 여부는 해당 feature controller 에서 결정한다.

---

## 모달

- 화면 한정 모달은 controller 내부 상태로 처리한다.
- 모달 컴포넌트는 표현과 emit 에 집중한다.
- localStorage 저장/복원처럼 흐름 성격의 로직은 controller 에 둔다.

---

## 다운로드

- 선택값 조합은 controller 에서 처리한다.
- 실제 요청은 `api/` 에 둔다.
- payload builder 가 복잡해지면 `lib/` 로 분리한다.

---

## 라우팅

- 페이지 컴포넌트는 `pages/` 아래에 둔다.
- 라우트 정의는 `src/app/router/*.routes.ts` 로 분리한다.
- 페이지 등록 시 lazy import 를 사용한다.

---

## i18n

- locale 관련 공용 로직은 `shared/i18n` 에 둔다.
- feature 전용 라벨도 공용 locale 파일에서 관리하되, 키 이름은 feature 맥락이 드러나게 유지한다.
