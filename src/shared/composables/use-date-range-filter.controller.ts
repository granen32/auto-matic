import { computed, reactive } from 'vue'

import {
  DEFAULT_DAILY_PRESET,
  DEFAULT_MODE,
  DEFAULT_MONTHLY_PRESET,
  DEFAULT_TIMEZONE,
  DEFAULT_WEEKLY_PRESET,
} from '@/shared/constants/date-range.constants'
import { resolveDateRange, validateDateRange } from '@/shared/utils/date-range'
import type {
  DailyPreset,
  DateRangeState,
  MonthlyPreset,
  RangeMode,
  WeeklyPreset,
} from '@/shared/types/date-range.types'

interface Options {
  timezone?: string
  defaultMode?: RangeMode
}

export function useDateRangeFilterController(options?: Options) {
  const state = reactive<DateRangeState>({
    mode: options?.defaultMode ?? DEFAULT_MODE,
    dailyPreset: DEFAULT_DAILY_PRESET,
    weeklyPreset: DEFAULT_WEEKLY_PRESET,
    monthlyPreset: DEFAULT_MONTHLY_PRESET,
    startDate: null,
    endDate: null,
    startMonth: null,
    endMonth: null,
    timezone: options?.timezone ?? DEFAULT_TIMEZONE,
  })

  const resolvedRange = computed(() => resolveDateRange(state))
  const validationErrors = computed(() => validateDateRange(state))
  const isValid = computed(() => validationErrors.value.length === 0)

  function resetCustomInputs() {
    state.startDate = null
    state.endDate = null
    state.startMonth = null
    state.endMonth = null
  }

  function setMode(mode: RangeMode) {
    state.mode = mode
    resetCustomInputs()
  }

  function setDailyPreset(preset: DailyPreset) {
    state.dailyPreset = preset
    if (preset !== 'custom-date') resetCustomInputs()
  }

  function setWeeklyPreset(preset: WeeklyPreset) {
    state.weeklyPreset = preset
    if (preset !== 'custom-date-weeks') resetCustomInputs()
  }

  function setMonthlyPreset(preset: MonthlyPreset) {
    state.monthlyPreset = preset
    if (preset !== 'custom-month') resetCustomInputs()
  }

  /** daily / weekly 공용 date 범위 setter */
  function setCustomDateRange(startDate: string, endDate: string) {
    state.startDate = startDate
    state.endDate = endDate
  }

  function setCustomMonthRange(startMonth: string, endMonth: string) {
    state.startMonth = startMonth
    state.endMonth = endMonth
  }

  return {
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
  }
}
