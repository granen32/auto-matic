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


      <!-- 키워드 테이블 -->
      <div class="border border-gray-200 rounded overflow-hidden">
        <div class="max-h-[460px] overflow-y-auto scrollbar-hide">
          <table class="w-full text-sm border-collapse">
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr class="border-b border-gray-200">
                <th class="w-12 px-3 py-2.5 text-center">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    @change="emit('toggleAll', activeGroupId)"
                  />
                </th>
                <th class="w-1/3 px-3 py-2.5 text-left font-semibold text-gray-700">
                  {{ t('download.columnHeaderName') }}
                </th>
                <th class="px-3 py-2.5 text-left font-semibold text-gray-700">
                  {{ t('download.columnHeaderDescription') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="field in filteredFields"
                :key="field.key"
                class="border-b border-gray-100 last:border-b-0 hover:bg-blue-50/40 cursor-pointer transition-colors"
                :class="{ 'bg-blue-50/60': field.checked }"
                @click="emit('toggleField', activeGroupId, field.key)"
              >
                <td class="px-3 py-2.5 text-center">
                  <input
                    type="checkbox"
                    :checked="field.checked"
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 pointer-events-none"
                    tabindex="-1"
                  />
                </td>
                <td class="px-3 py-2.5 font-medium text-gray-900">{{ field.name }}</td>
                <td class="px-3 py-2.5 text-gray-600">{{ field.description }}</td>
              </tr>
              <tr v-if="filteredFields.length === 0">
                <td colspan="3" class="py-10 text-center text-sm text-gray-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
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
