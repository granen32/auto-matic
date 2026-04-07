<script setup lang="ts">
import { computed, ref } from 'vue'

import BaseModal from './base-modal.vue'
import { useI18n } from '@/shared/i18n/use-i18n'
import type { DownloadFieldGroup } from '@/shared/types/download-field.types'

interface Props {
  isOpen: boolean
  groups: DownloadFieldGroup[]
  activeGroupId: string
  isDownloadable: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  changeGroup: [groupId: string]
  toggleField: [groupId: string, key: string]
  toggleAll: [groupId: string]
  download: []
}>()

const { t } = useI18n()
const searchTerm = ref('')

const activeGroup = computed(
  () => props.groups.find((g) => g.id === props.activeGroupId) ?? props.groups[0],
)

const filteredFields = computed(() => {
  const list = activeGroup.value?.fields ?? []
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.key.toLowerCase().includes(q),
  )
})

const selectedCount = computed(
  () => activeGroup.value?.fields.filter((f) => f.checked).length ?? 0,
)
const totalCount = computed(() => activeGroup.value?.fields.length ?? 0)
const isAllSelected = computed(
  () => totalCount.value > 0 && selectedCount.value === totalCount.value,
)
</script>

<template>
  <BaseModal :is-open="isOpen" :title="t('download.title')" width="880px" @close="emit('close')">
    <div class="space-y-4">
      <!-- 탭 -->
      <div class="flex items-center gap-1 border-b border-gray-200">
        <button
          v-for="g in groups"
          :key="g.id"
          type="button"
          class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
          :class="
            g.id === activeGroupId
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          "
          @click="emit('changeGroup', g.id)"
        >
          {{ t(g.titleKey) }}
        </button>
      </div>

      <!-- 검색 + 카운트 + 전체 선택 -->
      <div class="flex items-center gap-3">
        <input
          v-model="searchTerm"
          type="text"
          :placeholder="t('download.searchPlaceholder')"
          class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span class="text-sm text-gray-700 whitespace-nowrap">
          {{ t('download.selectedCount') }}
          <span class="font-semibold text-blue-600">{{ selectedCount }}</span>
          / {{ totalCount }}
        </span>
        <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            :checked="isAllSelected"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            @change="emit('toggleAll', activeGroupId)"
          />
          <span class="text-sm font-medium text-gray-700">{{ t('download.selectAll') }}</span>
        </label>
      </div>

      <!-- 키워드 그리드 -->
      <div
        class="grid grid-cols-2 gap-2 max-h-[460px] overflow-y-auto pr-1"
      >
        <button
          v-for="field in filteredFields"
          :key="field.key"
          type="button"
          class="flex items-start gap-3 p-3 text-left border rounded transition-colors"
          :class="
            field.checked
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          "
          @click="emit('toggleField', activeGroupId, field.key)"
        >
          <input
            type="checkbox"
            :checked="field.checked"
            class="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 pointer-events-none"
            tabindex="-1"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ field.name }}</p>
            <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ field.description }}</p>
          </div>
        </button>
        <p
          v-if="filteredFields.length === 0"
          class="col-span-2 py-10 text-center text-sm text-gray-400"
        >
          —
        </p>
      </div>
    </div>

    <template #footer>
      <button
        :disabled="!isDownloadable"
        class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="emit('download')"
      >
        {{ t('download.downloadExcel') }}
      </button>
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        @click="emit('close')"
      >
        {{ t('download.cancel') }}
      </button>
    </template>
  </BaseModal>
</template>
