# 구현 패턴

Claude가 이 프로젝트에서 우선적으로 제안해야 하는 구현 패턴을 정리한다.

---

## 검색 화면

- 검색어, 정렬, 페이지 등 입력 상태는 **controller 내부 ref**로 관리한다.
- 조회는 **React Query**로 처리하고, query key는 검색 조건 기준으로 안정적으로 구성한다.
- 입력 디바운스가 필요하면 `shared/composables/use-debounce.ts`를 사용한다.
- 검색 결과로부터 파생되는 필터 목록(facet 등)은 **검색 응답 모델의 일부**로 본다.

```ts
// 예: use-v2v-search.controller.ts
const keyword = ref('')
const debounced = useDebounce(keyword, 250)

const query = useQuery({
  queryKey: ['v2v', 'search', debounced],
  queryFn: () => searchPenot({ keyword: debounced.value }),
  enabled: computed(() => debounced.value.length > 0),
})
```

---

## 테이블 / 그리드

- 단순 목록은 **Data Table** 우선.
- 컬럼 커스터마이징, 가상화, 고급 기능이 필요하면 **AG Grid**를 고려한다.
- 컬럼 정의는 feature 내부 `types` 또는 `constants` 근처에서 관리한다.
- 컬럼 정의도 가능한 한 타입을 명확히 한다.

---

## 모달

- 전역 모달 store를 남용하지 않는다.
- 화면 한정 모달은 **page controller 또는 feature controller 내부 상태**로 처리한다.
- 모달 본체는 표현 컴포넌트로 두고, 열림 상태와 confirm/cancel 흐름은 controller에서 관리한다.

---

## 다운로드

- controller에서 payload를 조합한다.
- api 계층에서 실제 요청을 수행한다.
- 버튼 disabled, loading, validation 상태를 명확히 분리한다.
- 사용자가 마지막에 선택한 옵션은 가능하면 localStorage에 보관한다.

---

## 상세 패널

- 목록 선택 상태는 **controller가 관리**한다.
- 패널 컴포넌트는 전달받은 view model만 렌더링한다.
- 선택된 항목으로부터 파생되는 데이터(요약, 차트용 데이터 등)도 controller에서 가공한다.

---

## D3 차트

권장 흐름:

1. API 또는 store에서 데이터 조회
2. controller에서 차트용 데이터로 가공
3. component에서 `ref`와 lifecycle 관리
4. renderer에서 draw / update / cleanup 수행

권장 파일 구조:

```txt
sales-chart.vue
use-sales-chart.controller.ts
sales-chart-renderer.ts
sales-chart.types.ts
```

상세 규칙은 [D3 작성 규칙](../conventions/d3.md) 참고.
