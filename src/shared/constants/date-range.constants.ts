import type {
  DailyPreset,
  MonthlyPreset,
  RangeMode,
  WeeklyPreset,
} from '@/shared/types/date-range.types'

export const DEFAULT_TIMEZONE = 'Asia/Seoul'

export const DEFAULT_DAILY_PRESET: DailyPreset = 'today'
export const DEFAULT_WEEKLY_PRESET: WeeklyPreset = 'last-1-week'
export const DEFAULT_MONTHLY_PRESET: MonthlyPreset = 'last-1-month'
export const DEFAULT_MODE: RangeMode = 'daily'

export const WEEK_START_DAY = 1 // ISO week: 월요일

/** preset 값 목록. 화면 라벨은 i18n에서 가져온다 (`dateRange.preset.{value}`). */
export const DAILY_PRESET_VALUES: readonly DailyPreset[] = [
  'today',
  'last-day',
  'last-7-days',
  'last-14-days',
  'last-30-days',
  'custom-date',
] as const

export const WEEKLY_PRESET_VALUES: readonly WeeklyPreset[] = [
  'last-1-week',
  'last-2-weeks',
  'last-4-weeks',
  'last-8-weeks',
  'last-12-weeks',
  'custom-date-weeks',
] as const

export const MONTHLY_PRESET_VALUES: readonly MonthlyPreset[] = [
  'last-1-month',
  'last-3-months',
  'last-6-months',
  'last-12-months',
  'custom-month',
] as const
