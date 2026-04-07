import moment from 'moment-timezone'

import { WEEK_START_DAY } from '@/shared/constants/date-range.constants'
import type {
  DailyPreset,
  DateRangeState,
  MonthlyPreset,
  RangeMode,
  ResolvedDateRange,
  WeeklyPreset,
} from '@/shared/types/date-range.types'

const DATE_FMT = 'YYYY-MM-DD'
const MONTH_FMT = 'YYYY-MM'

function now(tz: string) {
  return moment.tz(tz)
}

function buildRange(
  mode: RangeMode,
  preset: string,
  timezone: string,
  from: moment.Moment,
  to: moment.Moment,
  format: string,
): ResolvedDateRange {
  const fromStr = from.format(format)
  const toStr = to.format(format)
  return {
    mode,
    preset,
    timezone,
    from: fromStr,
    to: toStr,
    displayFrom: fromStr,
    displayTo: toStr,
  }
}

// ─── Daily ────────────────────────────────────────────────

const DAILY_OFFSETS: Record<Exclude<DailyPreset, 'custom-date'>, { back: number; useYesterday?: boolean }> = {
  'today': { back: 0 },
  'last-day': { back: 0, useYesterday: true },
  'last-7-days': { back: 6 },
  'last-14-days': { back: 13 },
  'last-30-days': { back: 29 },
}

export function getDailyRange(
  preset: Exclude<DailyPreset, 'custom-date'>,
  timezone: string,
): ResolvedDateRange {
  const today = now(timezone)
  const offset = DAILY_OFFSETS[preset]

  const to = offset.useYesterday
    ? today.clone().subtract(1, 'day').endOf('day')
    : today.clone().endOf('day')

  const from = offset.useYesterday
    ? today.clone().subtract(1, 'day').startOf('day')
    : today.clone().subtract(offset.back, 'days').startOf('day')

  return buildRange('daily', preset, timezone, from, to, DATE_FMT)
}

// ─── Weekly ───────────────────────────────────────────────

const WEEKLY_COUNTS: Record<Exclude<WeeklyPreset, 'custom-date-weeks'>, number> = {
  'last-1-week': 1,
  'last-2-weeks': 2,
  'last-4-weeks': 4,
  'last-8-weeks': 8,
  'last-12-weeks': 12,
}

/** 주어진 moment를 해당 주의 시작(월요일)으로 정규화 */
function normalizeToWeekStart(m: moment.Moment): moment.Moment {
  const weekStart = m.clone().isoWeekday(WEEK_START_DAY)
  return weekStart.isAfter(m) ? weekStart.subtract(7, 'days') : weekStart
}

export function getWeeklyRange(
  preset: Exclude<WeeklyPreset, 'custom-date-weeks'>,
  timezone: string,
): ResolvedDateRange {
  const today = now(timezone)
  const currentWeekStart = normalizeToWeekStart(today)
  const currentWeekEnd = currentWeekStart.clone().add(6, 'days').endOf('day')

  const weeks = WEEKLY_COUNTS[preset]
  const from = currentWeekStart
    .clone()
    .subtract(weeks - 1, 'weeks')
    .startOf('day')

  return buildRange('weekly', preset, timezone, from, currentWeekEnd, DATE_FMT)
}

// ─── Monthly ──────────────────────────────────────────────

const MONTHLY_COUNTS: Record<Exclude<MonthlyPreset, 'custom-month'>, number> = {
  'last-1-month': 1,
  'last-3-months': 3,
  'last-6-months': 6,
  'last-12-months': 12,
}

export function getMonthlyRange(
  preset: Exclude<MonthlyPreset, 'custom-month'>,
  timezone: string,
): ResolvedDateRange {
  const today = now(timezone)
  const currentMonthStart = today.clone().startOf('month')
  const currentMonthEnd = today.clone().endOf('month')

  const months = MONTHLY_COUNTS[preset]
  const from = currentMonthStart
    .clone()
    .subtract(months - 1, 'months')
    .startOf('month')

  return buildRange('monthly', preset, timezone, from, currentMonthEnd, MONTH_FMT)
}

// ─── Custom ───────────────────────────────────────────────

export function getCustomDailyRange(
  startDate: string,
  endDate: string,
  timezone: string,
): ResolvedDateRange {
  return {
    mode: 'daily',
    preset: 'custom-date',
    timezone,
    from: startDate,
    to: endDate,
    displayFrom: startDate,
    displayTo: endDate,
  }
}

export function getCustomWeeklyRange(
  startWeekDate: string,
  endWeekDate: string,
  timezone: string,
): ResolvedDateRange {
  const start = moment.tz(startWeekDate, timezone)
  const end = moment.tz(endWeekDate, timezone)

  const normalizedStart = normalizeToWeekStart(start)
  const normalizedEnd = normalizeToWeekStart(end).add(6, 'days')

  return buildRange('weekly', 'custom-date-weeks', timezone, normalizedStart, normalizedEnd, DATE_FMT)
}

export function getCustomMonthlyRange(
  startMonth: string,
  endMonth: string,
  timezone: string,
): ResolvedDateRange {
  return {
    mode: 'monthly',
    preset: 'custom-month',
    timezone,
    from: startMonth,
    to: endMonth,
    displayFrom: startMonth,
    displayTo: endMonth,
  }
}

// ─── Resolver ─────────────────────────────────────────────

export function resolveDateRange(state: DateRangeState): ResolvedDateRange | null {
  const { mode, timezone } = state

  switch (mode) {
    case 'daily':
      if (state.dailyPreset === 'custom-date') {
        if (!state.startDate || !state.endDate) return null
        return getCustomDailyRange(state.startDate, state.endDate, timezone)
      }
      return getDailyRange(state.dailyPreset, timezone)

    case 'weekly':
      if (state.weeklyPreset === 'custom-date-weeks') {
        if (!state.startDate || !state.endDate) return null
        return getCustomWeeklyRange(state.startDate, state.endDate, timezone)
      }
      return getWeeklyRange(state.weeklyPreset, timezone)

    case 'monthly':
      if (state.monthlyPreset === 'custom-month') {
        if (!state.startMonth || !state.endMonth) return null
        return getCustomMonthlyRange(state.startMonth, state.endMonth, timezone)
      }
      return getMonthlyRange(state.monthlyPreset, timezone)
  }
}

// ─── Validation ───────────────────────────────────────────

export interface ValidationError {
  field: string
  message: string
}

interface CustomRangeValidationInput {
  startField: string
  endField: string
  startValue: string | null
  endValue: string | null
  startMissingMessage: string
  endMissingMessage: string
  orderInvalidMessage: string
  futureMessage: string
  isFuture: (value: string) => boolean
}

function validateCustomRange(input: CustomRangeValidationInput): ValidationError[] {
  const errors: ValidationError[] = []
  const {
    startField,
    endField,
    startValue,
    endValue,
    startMissingMessage,
    endMissingMessage,
    orderInvalidMessage,
    futureMessage,
    isFuture,
  } = input

  if (!startValue) errors.push({ field: startField, message: startMissingMessage })
  if (!endValue) errors.push({ field: endField, message: endMissingMessage })
  if (startValue && endValue && startValue > endValue) {
    errors.push({ field: startField, message: orderInvalidMessage })
  }
  if (endValue && isFuture(endValue)) {
    errors.push({ field: endField, message: futureMessage })
  }

  return errors
}

export function validateDateRange(state: DateRangeState): ValidationError[] {
  const { mode, timezone } = state
  const today = now(timezone)
  const isFutureDay = (v: string) => moment.tz(v, timezone).isAfter(today, 'day')
  const isFutureMonth = (v: string) => moment.tz(`${v}-01`, timezone).isAfter(today, 'month')

  if (mode === 'daily' && state.dailyPreset === 'custom-date') {
    return validateCustomRange({
      startField: 'startDate',
      endField: 'endDate',
      startValue: state.startDate,
      endValue: state.endDate,
      startMissingMessage: '시작일을 선택해주세요.',
      endMissingMessage: '종료일을 선택해주세요.',
      orderInvalidMessage: '시작일이 종료일보다 뒤에 올 수 없습니다.',
      futureMessage: '미래 날짜는 선택할 수 없습니다.',
      isFuture: isFutureDay,
    })
  }

  if (mode === 'weekly' && state.weeklyPreset === 'custom-date-weeks') {
    return validateCustomRange({
      startField: 'startDate',
      endField: 'endDate',
      startValue: state.startDate,
      endValue: state.endDate,
      startMissingMessage: '시작 주를 선택해주세요.',
      endMissingMessage: '종료 주를 선택해주세요.',
      orderInvalidMessage: '시작 주가 종료 주보다 뒤에 올 수 없습니다.',
      futureMessage: '미래 날짜는 선택할 수 없습니다.',
      isFuture: isFutureDay,
    })
  }

  if (mode === 'monthly' && state.monthlyPreset === 'custom-month') {
    return validateCustomRange({
      startField: 'startMonth',
      endField: 'endMonth',
      startValue: state.startMonth,
      endValue: state.endMonth,
      startMissingMessage: '시작월을 선택해주세요.',
      endMissingMessage: '종료월을 선택해주세요.',
      orderInvalidMessage: '시작월이 종료월보다 뒤에 올 수 없습니다.',
      futureMessage: '미래 월은 선택할 수 없습니다.',
      isFuture: isFutureMonth,
    })
  }

  return []
}
