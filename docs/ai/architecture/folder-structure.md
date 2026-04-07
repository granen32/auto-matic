# 권장 폴더 구조

이 프로젝트는 **feature-first** 구조를 우선한다. page는 진입점, feature는 실제 기능 구현 위치, shared는 정말로 공용인 것만 둔다.

---

## 전체 구조

```txt
src/
├─ app/
│  ├─ providers/
│  ├─ router/
│  └─ stores/
│
├─ pages/
│  ├─ auth/
│  │  └─ login-page.vue
│  ├─ dashboard/
│  │  └─ dashboard-page.vue
│  └─ v2v/
│     └─ v2v-page.vue
│
├─ features/
│  ├─ auth/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ controllers/
│  │  ├─ stores/
│  │  └─ types/
│  │
│  ├─ dashboard/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ controllers/
│  │  ├─ lib/
│  │  ├─ stores/
│  │  └─ types/
│  │
│  └─ v2v/
│     ├─ api/
│     ├─ components/
│     ├─ controllers/
│     ├─ stores/
│     ├─ lib/
│     └─ types/
│
└─ shared/
   ├─ api/
   ├─ components/
   ├─ composables/
   ├─ constants/
   ├─ i18n/
   ├─ types/
   └─ utils/
```

---

## 기본 원칙

- **page** — 라우트 진입점. 레이아웃과 feature 컴포넌트 조합만 담당.
- **feature** — 실제 기능 구현 위치. 가능하면 자급자족.
- **shared** — 정말로 여러 feature가 공유하는 것만. 무리해서 끌어올리지 않는다.
- 한 feature가 다른 feature 내부 파일을 직접 import하지 않는다. 공유가 필요해지면 `shared/`로 올린다.
- 폴더명은 모두 kebab-case.

---

## feature 내부 권장 하위 폴더

| 폴더 | 역할 |
| --- | --- |
| `api/` | 백엔드 통신 + mapper |
| `components/` | feature 전용 표현 컴포넌트 (.vue) |
| `controllers/` | `use-*.controller.ts` — 비즈니스 흐름 |
| `stores/` | feature 전용 Pinia store |
| `types/` | 도메인/응답/뷰모델 타입 |
| `lib/` | renderer, payload builder, adapter 등 저수준 로직 |

각 하위 폴더는 필요할 때만 만든다. 단순한 feature는 `components`와 `controllers`만 있어도 충분하다.

---

## shared 하위 폴더

| 폴더 | 역할 |
| --- | --- |
| `api/` | 공용 fetcher / 인터셉터 |
| `components/` | 디자인 시스템 / 공용 UI |
| `composables/` | 공용 utility composable (`use-debounce.ts` 등) |
| `constants/` | 전역 상수 |
| `i18n/` | 다국어 사전 + locale composable |
| `types/` | 공용 타입 |
| `utils/` | 순수 함수 utility |
