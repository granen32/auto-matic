# 코드 생성 시 선호 포맷

코드 예시를 제시할 때 따라야 하는 형식이다.

---

## Vue SFC

- `<script setup lang="ts">` 사용
- props / emits 는 타입 인자 형태를 우선
- 필요 시 `withDefaults` 로 기본값 명시

```vue
<script setup lang="ts">
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()
</script>
```

---

## Composable

- 함수형 export 사용
- 반환값은 명시적으로 객체로 묶어서 반환
- controller 는 상태와 액션 이름이 바로 드러나게 작성

---

## import

- 외부 패키지 → alias 경로 → 상대 경로 순으로 배치
- alias 는 `@/` 사용

---

## 주석

- 자명한 설명 주석은 쓰지 않는다.
- "왜 필요한가"가 드러나지 않을 때만 짧게 남긴다.
- TODO 는 다음 액션이 보이게 작성한다.

---

## 문서 예시 규칙

- 가능하면 파일 경로를 함께 제시한다.
- 여러 레이어가 걸친 예시는 파일 단위로 나눠 보여준다.
- 현재 코드베이스 구조와 다른 경로는 예시로 남발하지 않는다.
