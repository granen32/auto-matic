# 레이어 역할 정의

현재 프로젝트 기준으로 각 레이어가 무엇을 해야 하고, 무엇을 하지 말아야 하는지 정리한다.

---

## 1) app

앱 전역 조립 영역이다.

해야 하는 일:

- `app.vue` 에서 `router-view` 렌더링
- router 인스턴스 생성
- 추후 전역 provider, plugin, guard 설정

하지 말아야 하는 일:

- feature 전용 비즈니스 로직 구현
- 화면별 API 호출 구현

---

## 2) pages

페이지 진입점만 담당한다.

해야 하는 일:

- 라우트 진입
- feature 컴포넌트 조합
- 페이지 레벨 레이아웃 배치

하지 말아야 하는 일:

- API 직접 호출
- 긴 비즈니스 흐름 보유
- 복잡한 검색 조건 조합
- 다운로드 정책 처리

---

## 3) features

실제 비즈니스 기능 구현 위치다.

포함 가능:

- API 호출 로직
- 컨트롤러
- feature 전용 타입
- 화면 전용 payload 변환
- feature 전용 표현 컴포넌트

---

## 4) components

표현 중심이어야 한다.

포함 가능:

- props / emits
- 마크업
- 기본 UI 상태 표시
- 리스트/패널 렌더링
- 공용 모달/필터 UI

지양:

- API orchestration
- router/query/store 다중 연결
- 템플릿 안의 복잡한 계산

---

## 5) controllers

UI 와 데이터 리소스 사이의 orchestration layer 다.

포함 가능:

- API 호출 순서 제어
- 화면 상태 조합
- 선택 상태와 파생 상태 계산
- router / query 연결
- 로딩 / 에러 / 재시도 처리
- 다운로드 흐름 제어

포함하면 안 되는 것:

- 정적 마크업
- 스타일링
- 범용 유틸 함수

파일명 규칙:

- `use-{domain}.controller.ts`
- `use-{feature}-{action}.controller.ts`

---

## 6) api

백엔드 통신과 응답 정제를 담당한다.

규칙:

- 서버 응답 타입과 UI 모델이 다르면 이 계층 근처에서 변환한다.
- 원본 응답 필드명을 UI 전체에 그대로 퍼뜨리지 않는다.
- mock 데이터도 가능하면 이 계층 주변에 둔다.

---

## 7) stores

Pinia 는 공유 상태에만 사용한다.

store 로 올릴 수 있는 것:

- 사용자 세션
- 권한 정보
- 전역 UI 설정
- 여러 page/feature 가 함께 써야 하는 상태

store 로 올리지 않는 것:

- 페이지 검색어
- 모달 열림 여부
- 현재 선택 row
- 일회성 로딩 상태

---

## 8) lib

feature 내부의 순수 로직을 둔다.

예시:

- mapper
- export payload builder
- adapter
- formatter
