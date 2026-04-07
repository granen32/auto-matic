<script setup lang="ts">
import { useI18n, type Locale } from '@/shared/i18n/use-i18n'

const { locale, setLocale } = useI18n()

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'ko', label: 'KO' },
  { value: 'en', label: 'EN' },
]
</script>

<template>
  <div class="flex items-center gap-1 text-xs">
    <button
      v-for="opt in LOCALES"
      :key="opt.value"
      type="button"
      class="px-2 py-1 rounded border transition-colors"
      :class="
        locale === opt.value
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      "
      @click="setLocale(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
