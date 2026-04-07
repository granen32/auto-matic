# CLAUDE.md

## 목적
이 문서는 아이티센 프론트엔드 프로젝트에서 Claude 또는 유사한 AI 코딩 어시스턴트가 코드 생성, 리팩토링, 구조 제안, 리뷰를 수행할 때 따라야 할 아키텍처 및 구현 가이드를 정리한 문서이다.

이 프로젝트의 기본 원칙은 다음 두 자료를 따른다.

- FE 아키텍처 가이드 (`fe.md`)
- 현재 합의된 V2V 화면/플로우 방향 (`v2v_design_page.html`)

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
- [React Query / Pinia 역할 분리](./architecture/state-management.md)

### 코드 규칙
- [네이밍 규칙](./conventions/naming.md)
- [TypeScript 규칙](./conventions/typescript.md)
- [D3 작성 규칙](./conventions/d3.md)
- [코드 생성 시 선호 포맷](./conventions/code-format.md)

### 기능별 가이드
- [V2V 기능 가이드](./features/v2v.md)

---

## 한 줄 요약

이 프로젝트에서 Claude는 **Vue 3 + TypeScript + Pinia + React Query + D3 + feature-first + controller 분리** 원칙을 기준으로, **page → feature component → controller → api/store/lib** 흐름에 맞춰 제안해야 한다.
