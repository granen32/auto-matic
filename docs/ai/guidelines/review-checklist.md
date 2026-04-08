# 리뷰 체크리스트

코드 리뷰나 구조 리뷰 시 우선 확인하는 항목이다.

---

## 기본 스택 & 컨벤션

- [ ] Vue 3 + TypeScript 기준인가
- [ ] `<script setup lang="ts">` 를 사용하고 있는가
- [ ] 파일 / 폴더명이 kebab-case 인가
- [ ] import path 가 alias(`@/`) 기준인가
- [ ] 라우팅이 `vue-router` 구조와 맞는가

---

## 레이어 분리

- [ ] page 가 진입점 역할만 하는가
- [ ] feature 내부 로직이 `features/{feature}` 아래에 모여 있는가
- [ ] 비즈니스 흐름 composable 이 `.controller.ts` 규칙을 따르는가
- [ ] 단순 유틸 composable 에 `.controller.ts` 를 붙이지 않았는가
- [ ] 컴포넌트가 props / emits / 렌더링 중심인가

---

## 상태 관리

- [ ] 서버 상태를 Vue Query 로 관리하는가
- [ ] 페이지/모달 한정 상태를 Pinia 로 올리지 않았는가
- [ ] query key 가 입력값 기준으로 안정적으로 구성되는가
- [ ] controller 내부 상태와 공유 상태의 경계가 명확한가

---

## API / 데이터

- [ ] 응답 정제(mapping)가 API 계층 근처에서 이루어지는가
- [ ] 응답 원본 필드명이 UI 전역에 직접 노출되지 않는가
- [ ] payload 조합 로직이 component 밖에 있는가

---

## 라우팅

- [ ] 새 페이지가 `pages/` 에 위치하는가
- [ ] 새 라우트가 `src/app/router/*.routes.ts` 에 등록되었는가
- [ ] 페이지 컴포넌트가 lazy import 로 연결되는가

---

## 타입

- [ ] `any` 사용을 피했는가
- [ ] controller public return shape 가 충분히 명확한가
- [ ] 외부 데이터 파싱 시 `unknown` 또는 검증 흐름을 거치는가
