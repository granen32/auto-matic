# 레이어 역할 정의

각 레이어가 무엇을 해야 하고, 무엇을 하지 말아야 하는지를 정리한다.

---

## 1) pages

**페이지 진입점만 담당한다.**

해야 하는 일:
- 라우트 진입
- feature 컴포넌트 조립
- 페이지 레벨 레이아웃 배치

하지 말아야 하는 일:
- API 직접 호출
- 복잡한 필터 조합
- 차트 데이터 가공
- 다운로드 정책 처리

---

## 2) features

**실제 비즈니스 기능 구현 위치다.**

feature 내부에는 가능하면 아래를 함께 둔다.

- `api/`
- `components/`
- `controllers/`
- `stores/`
- `types/`
- `lib/` (D3 renderer 등)

---

## 3) components

**표현 중심이어야 한다.**

포함 가능:
- props / emits
- 마크업
- 기본 UI 상태 표시
- 테이블/그리드 렌더링
- 차트 컨테이너

지양:
- API orchestration
- 복잡한 파생 상태 계산
- store / router / query 다중 연결
- 다운로드/검색 정책 판단

---

## 4) controllers

**UI와 domain resource 사이의 orchestration layer다.**

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
- 너무 범용적인 순수 유틸 (그건 `shared/utils`)
- D3 draw / axis / transition 내부 구현

파일명 규칙: `use-{domain}.controller.ts` 또는 `use-{feature}-{action}.controller.ts`

---

## 5) api

**백엔드 통신과 응답 정제를 담당한다.**

규칙:
- 서버 응답 타입과 UI view model 타입이 다르면 이 계층 근처에서 변환한다.
- 원본 응답 필드명을 UI 전역에 그대로 노출하지 않는다.
- fetcher / request / mapper를 이 레이어 주변에 둔다.
- HTTP 에러를 도메인 에러로 변환하는 곳도 여기.

---

## 6) stores

**Pinia는 공유 상태에만 사용한다.**

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

---

## 7) lib

**renderer, 옵션 빌더, 어댑터 등 feature 내부 저수준 로직을 둔다.**

예시:
- `sales-chart-renderer.ts` — D3 draw / update / cleanup
- `sales-chart-options.ts` — 차트 옵션 빌드
- `v2v-export-payload.ts` — 다운로드 payload 변환
