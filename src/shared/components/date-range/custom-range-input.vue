<script setup lang="ts">
type InputType = 'date' | 'month'

interface Props {
  type: InputType
  startValue: string | null
  endValue: string | null
  startError?: string
  endError?: string
  /** 종료값 max로 사용할 오늘 (YYYY-MM-DD 또는 YYYY-MM) */
  todayBound: string
}

defineProps<Props>()

defineEmits<{
  change: [start: string, end: string]
}>()
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex flex-col gap-1">
      <input
        :type="type"
        :value="startValue"
        :max="endValue ?? todayBound"
        class="px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-500"
        @input="
          $emit(
            'change',
            ($event.target as HTMLInputElement).value,
            endValue ?? '',
          )
        "
      />
      <span v-if="startError" class="text-xs text-red-500">{{ startError }}</span>
    </div>
    <span class="text-sm text-gray-400">~</span>
    <div class="flex flex-col gap-1">
      <input
        :type="type"
        :value="endValue"
        :min="startValue ?? undefined"
        :max="todayBound"
        class="px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-500"
        @input="
          $emit(
            'change',
            startValue ?? '',
            ($event.target as HTMLInputElement).value,
          )
        "
      />
      <span v-if="endError" class="text-xs text-red-500">{{ endError }}</span>
    </div>
  </div>
</template>
