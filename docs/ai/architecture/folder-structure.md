# 권장 폴더 구조

현재 프로젝트는 **feature-first** 구조를 기준으로 한다.
실제 코드베이스는 `v2v` 단일 feature 중심으로 구성되어 있으며, 앞으로 feature가 늘어나도 같은 규칙을 유지한다.

---

## 현재 기준 구조

```txt
src/
├─ app/
│  ├─ app.vue
│  └─ router/
│     ├─ index.ts
│     ├─ routes.ts
│     └─ v2v.routes.ts
├─ pages/
│  └─ v2v/
│     └─ v2v-page.vue
├─ features/
│  └─ v2v/
│     ├─ api/
│     ├─ controllers/
│     ├─ lib/
│     └─ types/
├─ shared/
│  ├─ components/
│  ├─ composables/
│  ├─ constants/
│  ├─ i18n/
│  ├─ types/
│  └─ utils/
├─ main.ts
└─ styles.css
```

---

## 역할 구분

- `app/`
  - 앱 전역 조립 영역
  - `app.vue`, router 설정, 추후 providers 등록 위치
- `pages/`
  - 라우트 진입점
  - page shell 과 feature 조합만 담당
- `features/`
  - 실제 비즈니스 기능 구현 위치
  - 현재는 `v2v` feature만 존재
- `shared/`
  - 여러 feature 에서 공용으로 쓰는 UI, composable, util, i18n

---

## feature 내부 권장 하위 폴더

현재 `v2v` feature에는 `api / controllers / lib / types` 가 존재한다.
기능이 커질 경우 아래 구조를 기준으로 확장한다.

| 폴더 | 역할 |
| --- | --- |
| `api/` | 백엔드 통신, mock 응답, mapper |
| `components/` | feature 전용 표현 컴포넌트 |
| `controllers/` | `use-*.controller.ts` 기반 흐름 제어 |
| `stores/` | feature 공유 상태가 생겼을 때만 사용 |
| `types/` | feature 전용 타입 |
| `lib/` | 순수 mapper, payload builder, adapter |

---

## 현재 구조에서의 우선 원칙

- 새로운 페이지는 `pages/{feature}/{name}-page.vue` 에 둔다.
- 새로운 기능 로직은 `features/{feature}` 내부에 둔다.
- 공용으로 재사용되지 않는 코드는 성급하게 `shared/` 로 올리지 않는다.
- 한 feature 가 다른 feature 내부 파일을 직접 import 하지 않는다.
- 폴더명과 파일명은 모두 kebab-case 를 사용한다.
