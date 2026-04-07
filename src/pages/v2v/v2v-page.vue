<script setup lang="ts">
import { ref } from 'vue'

import DateRangeFilter from '@/shared/components/date-range-filter.vue'
import DownloadModal from '@/shared/components/download-modal.vue'
import LocaleSwitcher from '@/shared/components/locale-switcher.vue'
import { useI18n } from '@/shared/i18n/use-i18n'
import type { ResolvedDateRange } from '@/shared/types/date-range.types'
import { useV2vDownloadController } from '@/features/v2v/controllers/use-v2v-download.controller'

const { t } = useI18n()
const downloadCtrl = useV2vDownloadController()

// 와이어프레임용 임시 데이터
const searchKeyword = ref('')
const resultCount = ref(128)
const selectedKeywords = ref(['고객', 'VIP', '서울', '활성'])

const resultItems = ref([
  { id: '1', title: '리스트 항목 1', summary: '요약 정보 요약 정보' },
  { id: '2', title: '리스트 항목 2', summary: '요약 정보 요약' },
  { id: '3', title: '리스트 항목 3', summary: '' },
  { id: '4', title: '리스트 항목 4', summary: '' },
])

const selectedItemId = ref('1')
const appliedRange = ref<ResolvedDateRange | null>(null)

function handleSearch() {
  // TODO: 검색 API 연결
}

function handleDateRangeChange(range: ResolvedDateRange) {
  appliedRange.value = range
  // TODO: 선택된 기간으로 검색 재호출
}

function selectItem(id: string) {
  selectedItemId.value = id
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 space-y-4">
    <!-- 상단 검색 바 -->
    <div class="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
      <input
        v-model="searchKeyword"
        type="text"
        :placeholder="t('v2v.searchPlaceholder')"
        class="flex-1 px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        @keyup.enter="handleSearch"
      />
      <button
        type="button"
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        @click="handleSearch"
      >
        {{ t('v2v.search') }}
      </button>

      <LocaleSwitcher />

      <button
        type="button"
        class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        @click="downloadCtrl.openModal()"
      >
        {{ t('v2v.download') }}
      </button>
    </div>

    <!-- 검색 결과 정보 + 기간 필터 -->
    <div class="flex items-start gap-4">
      <div class="flex flex-1 items-center gap-4 bg-gray-100 px-4 py-3 rounded-lg">
        <span class="text-sm text-gray-700 font-medium">
          {{ t('v2v.resultCount', { count: resultCount }) }}
        </span>
        <span class="text-sm text-gray-500">{{ t('v2v.selectedKeywords') }}</span>
        <div class="flex items-center gap-2">
          <span
            v-for="kw in selectedKeywords"
            :key="kw"
            class="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded"
          >
            {{ kw }}
          </span>
        </div>
        <span v-if="appliedRange" class="ml-auto text-xs text-gray-500">
          {{ t('v2v.appliedRange') }}: {{ appliedRange.displayFrom }} ~ {{ appliedRange.displayTo }}
        </span>
      </div>
      <div class="w-[480px] shrink-0">
        <DateRangeFilter @change="handleDateRangeChange" />
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="grid grid-cols-2 gap-4">
      <!-- 좌측: 데이터 리스트 -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-4 py-3 bg-gray-800 text-white text-sm font-semibold rounded-t-lg">
          {{ t('v2v.dataList') }}
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="item in resultItems"
            :key="item.id"
            class="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
            :class="{ 'bg-blue-50 border-l-4 border-l-blue-500': selectedItemId === item.id }"
            @click="selectItem(item.id)"
          >
            <p class="text-sm font-medium text-gray-900">{{ item.title }}</p>
            <p v-if="item.summary" class="text-xs text-gray-500 mt-0.5">{{ item.summary }}</p>
          </div>
        </div>
      </div>

      <!-- 우측: 상세 정보 패널 -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-4 py-3 bg-gray-800 text-white text-sm font-semibold rounded-t-lg">
          {{ t('v2v.detailPanel') }}
        </div>
        <div class="p-4">
          <h3 class="text-base font-semibold text-gray-900">{{ t('v2v.detailEmptyTitle') }}</h3>
          <p class="mt-2 text-sm text-gray-500">{{ t('v2v.detailEmptyBody') }}</p>
        </div>
      </div>
    </div>

    <!-- 다운로드 키워드 선택 모달 -->
    <DownloadModal
      :is-open="downloadCtrl.isModalOpen.value"
      :groups="downloadCtrl.groups.value"
      :active-group-id="downloadCtrl.activeGroupId.value"
      :is-downloadable="downloadCtrl.isDownloadable.value"
      @close="downloadCtrl.closeModal"
      @change-group="downloadCtrl.changeGroup"
      @toggle-field="downloadCtrl.toggleField"
      @toggle-all="downloadCtrl.toggleAll"
      @download="downloadCtrl.handleDownload"
    />
  </div>
</template>
