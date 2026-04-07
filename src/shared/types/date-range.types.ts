export type RangeMode = 'daily' | 'weekly' | 'monthly'

export type DailyPreset =
  | 'today'
  | 'last-day'
  | 'last-7-days'
  | 'last-14-days'
  | 'last-30-days'
  | 'custom-date'

export type WeeklyPreset =
  | 'last-1-week'
  | 'last-2-weeks'
  | 'last-4-weeks'
  | 'last-8-weeks'
  | 'last-12-weeks'
  | 'custom-date-weeks'

export type MonthlyPreset =
  | 'last-1-month'
  | 'last-3-months'
  | 'last-6-months'
  | 'last-12-months'
  | 'custom-month'

export interface DateRangeState {
  mode: RangeMode
  dailyPreset: DailyPreset
  weeklyPreset: WeeklyPreset
  monthlyPreset: MonthlyPreset
  startDate: string | null
  endDate: string | null
  startMonth: string | null
  endMonth: string | null
  timezone: string
}

export interface ResolvedDateRange {
  mode: RangeMode
  preset: string
  timezone: string
  from: string
  to: string
  displayFrom: string
  displayTo: string
}
