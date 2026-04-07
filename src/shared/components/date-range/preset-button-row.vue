<script setup lang="ts" generic="T extends string">
interface PresetOption {
  value: T
  label: string
}

interface Props {
  presets: readonly PresetOption[]
  value: T
}

defineProps<Props>()

const emit = defineEmits<{
  change: [value: T]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="preset in presets"
      :key="preset.value"
      type="button"
      class="px-3 py-1.5 text-sm rounded border transition-colors"
      :class="
        value === preset.value
          ? 'border-blue-600 bg-blue-50 text-blue-700'
          : 'border-gray-200 text-gray-600 hover:border-gray-300'
      "
      @click="emit('change', preset.value)"
    >
      {{ preset.label }}
    </button>
  </div>
</template>
