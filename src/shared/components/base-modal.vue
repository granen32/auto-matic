<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '720px',
})

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black/40"
        @click="emit('close')"
      />

      <div
        class="relative z-10 max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col"
        :style="{ width: props.width }"
      >
        <!-- 헤더 -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">{{ title }}</h2>
          <button
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 본문 슬롯 -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <slot />
        </div>

        <!-- 푸터 슬롯 -->
        <div
          v-if="$slots.footer"
          class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
