# 리뷰 체크리스트

코드 리뷰나 구조 리뷰 시 우선 확인하는 항목이다.

---

## 기본 스택 & 컨벤션

- [ ] Vue 3 + TypeScript 기준인가
- [ ] 파일 / 폴더명이 kebab-case인가
- [ ] `<script setup lang="ts">`를 사용하고 있는가
- [ ] import path가 alias(`@/`) 기준인가

---

## 레이어 분리

- [ ] page는 진입점 역할만 하는가 (API 직접 호출/복잡한 필터 조합 없음)
- [ ] feature 내부에 `api / components / controllers / stores / types / lib`가 적절히 배치되어 있는가
- [ ] 비즈니스 흐름을 담당하는 composable이 `.controller.ts` 규칙을 따르는가
- [ ] 단순 유틸성 composable에는 `.controller.ts`가 붙어있지 않은가
- [ ] 컴포넌트가 props / emits / 렌더링 중심으로 유지되고 있는가

---

## 상태 관리

- [ ] Pinia가 공유 상태에만 쓰였는가
- [ ] 페이지/모달 한정 상태가 store에 올라가 있지 않은가
- [ ] React Query가 서버 상태(목록/상세/검색/다운로드)를 담당하는가
- [ ] query key가 입력값에 대해 안정적으로 구성되어 있는가

---

## API / 데이터

- [ ] API 응답 정제(mapping)가 API 계층 근처에서 이루어지는가
- [ ] 응답 원본 필드명이 UI 전역에 그대로 노출되어 있지 않은가
- [ ] 요청 payload 생성이 controller 또는 별도 mapper에 분리되어 있는가

---

## 템플릿 / 표현

- [ ] 템플릿에 복잡한 조건문 / 비즈니스 계산이 없는가
- [ ] 파생 상태가 template이 아니라 computed/controller에서 만들어지는가

---

## D3

- [ ] D3 로직이 renderer로 분리되어 있는가
- [ ] component는 ref / lifecycle / props만 다루고 있는가
- [ ] 데이터 가공이 controller에서 이루어지는가

---

## 타입

- [ ] `any` 사용을 피했는가
- [ ] controller 반환값이 명시적 타입을 가지는가
- [ ] AG Grid / Data Table column 정의에 타입이 붙어있는가
