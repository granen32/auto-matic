<script setup lang="ts">
import { computed } from 'vue'
import moment from 'moment-timezone'

import CustomRangeInput from './date-range/custom-range-input.vue'
import PresetButtonRow from './date-range/preset-button-row.vue'
import {
  DAILY_PRESET_VALUES,
  DEFAULT_TIMEZONE,
  MONTHLY_PRESET_VALUES,
  WEEKLY_PRESET_VALUES,
} from '@/shared/constants/date-range.constants'
import { useDateRangeFilterController } from '@/shared/composables/use-date-range-filter.controller'
import { useI18n } from '@/shared/i18n/use-i18n'
import type { RangeMode, ResolvedDateRange } from '@/shared/types/date-range.types'
import type { ValidationError } from '@/shared/utils/date-range'

interface Props {
  timezone?: string
  defaultMode?: RangeMode
}

const props = withDefaults(defineProps<Props>(), {
  timezone: undefined,
  defaultMode: undefined,
})

const emit = defineEmits<{
  change: [range: ResolvedDateRange]
}>()

const { t } = useI18n()

const {
  state,
  resolvedRange,
  validationErrors,
  isValid,
  setMode,
  setDailyPreset,
  setWeeklyPreset,
  setMonthlyPreset,
  setCustomDateRange,
  setCustomMonthRange,
} = useDateRangeFilterController({
  timezone: props.timezone,
  defaultMode: props.defaultMode,
})

function handleApply() {
  if (isValid.value && resolvedRange.value) {
    emit('change', resolvedRange.value)
  }
}

function getError(field: string): string | undefined {
  return validationErrors.value.find((e: ValidationError) => e.field === field)?.message
}

const tz = computed(() => props.timezone ?? DEFAULT_TIMEZONE)
const todayDate = computed(() => moment.tz(tz.value).format('YYYY-MM-DD'))
const todayMonth = computed(() => moment.tz(tz.value).format('YYYY-MM'))

const MODE_OPTIONS: { value: RangeMode; labelKey: string }[] = [
  { value: 'daily', labelKey: 'dateRange.daily' },
  { value: 'weekly', labelKey: 'dateRange.weekly' },
  { value: 'monthly', labelKey: 'dateRange.monthly' },
]

function toPresetOptions<T extends string>(values: readonly T[]) {
  return values.map((value) => ({ value, label: t(`dateRange.preset.${value}`) }))
}

const dailyPresets = computed(() => toPresetOptions(DAILY_PRESET_VALUES))
const weeklyPresets = computed(() => toPresetOptions(WEEKLY_PRESET_VALUES))
const monthlyPresets = computed(() => toPresetOptions(MONTHLY_PRESET_VALUES))
</script>

<template>
  <div class="flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-lg">
    <!-- Mode Selector -->
    <div class="flex gap-2">
      <button
        v-for="option in MODE_OPTIONS"
        :key="option.value"
        type="button"
        class="px-3 py-1.5 text-sm font-medium rounded transition-colors"
        :class="
          state.mode === option.value
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        "
        @click="setMode(option.value)"
      >
        {{ t(option.labelKey) }}
      </button>
    </div>

    <!-- Presets -->
    <PresetButtonRow
      v-if="state.mode === 'daily'"
      :presets="dailyPresets"
      :value="state.dailyPreset"
      @change="setDailyPreset"
    />
    <PresetButtonRow
      v-else-if="state.mode === 'weekly'"
      :presets="weeklyPresets"
      :value="state.weeklyPreset"
      @change="setWeeklyPreset"
    />
    <PresetButtonRow
      v-else
      :presets="monthlyPresets"
      :value="state.monthlyPreset"
      @change="setMonthlyPreset"
    />

    <!-- Custom Inputs -->
    <CustomRangeInput
      v-if="state.mode === 'daily' && state.dailyPreset === 'custom-date'"
      type="date"
      :start-value="state.startDate"
      :end-value="state.endDate"
      :start-error="getError('startDate')"
      :end-error="getError('endDate')"
      :today-bound="todayDate"
      @change="setCustomDateRange"
    />
    <CustomRangeInput
      v-else-if="state.mode === 'weekly' && state.weeklyPreset === 'custom-date-weeks'"
      type="date"
      :start-value="state.startDate"
      :end-value="state.endDate"
      :start-error="getError('startDate')"
      :end-error="getError('endDate')"
      :today-bound="todayDate"
      @change="setCustomDateRange"
    />
    <CustomRangeInput
      v-else-if="state.mode === 'monthly' && state.monthlyPreset === 'custom-month'"
      type="month"
      :start-value="state.startMonth"
      :end-value="state.endMonth"
      :start-error="getError('startMonth')"
      :end-error="getError('endMonth')"
      :today-bound="todayMonth"
      @change="setCustomMonthRange"
    />

    <!-- Resolved Range Display & Apply -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
      <span v-if="resolvedRange" class="text-sm text-gray-500">
        {{ resolvedRange.displayFrom }} ~ {{ resolvedRange.displayTo }}
      </span>
      <span v-else class="text-sm text-gray-400">{{ t('dateRange.selectPrompt') }}</span>
      <button
        type="button"
        :disabled="!isValid || !resolvedRange"
        class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="handleApply"
      >
        {{ t('dateRange.apply') }}
      </button>
    </div>
  </div>
</template>
