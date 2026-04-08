# CLAUDE.md

## 목적

이 문서는 현재 `claude` 프로젝트에서 AI 코딩 어시스턴트가 따라야 할 기준을 정리한다.
기준은 실제 코드베이스 구조와 현재 사용 중인 스택을 우선한다.

---

## 문서 구조

### 기본 설정

- [프로젝트 기준 스택](./stack.md)

### 가이드라인

- [가장 중요한 원칙](./guidelines/principles.md)
- [Claude 응답 규칙 및 기대 응답 방식](./guidelines/response-rules.md)
- [구현 패턴](./guidelines/patterns.md)
- [피해야 하는 제안](./guidelines/anti-patterns.md)
- [리뷰 체크리스트](./guidelines/review-checklist.md)

### 아키텍처

- [권장 폴더 구조](./architecture/folder-structure.md)
- [레이어 역할 정의](./architecture/layer-roles.md)
- [상태 관리 가이드](./architecture/state-management.md)
- [라우팅 가이드 (Vue Router)](./architecture/routing.md)

### 코드 규칙

- [네이밍 규칙](./conventions/naming.md)
- [TypeScript 규칙](./conventions/typescript.md)
- [D3 작성 규칙](./conventions/d3.md)
- [코드 생성 시 선호 포맷](./conventions/code-format.md)

### 기능별 가이드

- [V2V 기능 가이드](./features/v2v.md)

---

## 현재 프로젝트 요약

- 프레임워크: Vue 3 + TypeScript
- 라우팅: Vue Router 4
- 서버 상태: `@tanstack/vue-query`
- 클라이언트 공유 상태: Pinia
- 스타일: Tailwind CSS
- 번들러: Vite
- 현재 주요 feature: `v2v`

---

## 한 줄 요약

이 프로젝트에서 AI는 **Vue 3 + TypeScript + vue-router + Vue Query + Pinia + feature-first + controller 분리** 기준으로, **page → feature component → controller → api/lib/types** 흐름에 맞춰 제안해야 한다.
