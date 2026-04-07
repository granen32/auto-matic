import { ref, computed } from 'vue'

import analysisFieldsKo from './locales/analysis-fields.ko.json'
import analysisFieldsEn from './locales/analysis-fields.en.json'
import commonKo from './locales/common.ko.json'
import commonEn from './locales/common.en.json'

export type Locale = 'ko' | 'en'

export interface LocalizedField {
  name: string
  description: string
}

type AnalysisFieldDict = Record<string, LocalizedField>
type CommonDict = typeof commonKo

const analysisFieldsByLocale: Record<Locale, AnalysisFieldDict> = {
  ko: analysisFieldsKo as AnalysisFieldDict,
  en: analysisFieldsEn as AnalysisFieldDict,
}

const commonByLocale: Record<Locale, CommonDict> = {
  ko: commonKo,
  en: commonEn,
}

const STORAGE_KEY = 'app-locale'

function loadInitialLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'en' || saved === 'ko' ? saved : 'ko'
}

const currentLocale = ref<Locale>(loadInitialLocale())

function setLocale(next: Locale) {
  currentLocale.value = next
  localStorage.setItem(STORAGE_KEY, next)
}

function resolvePath(dict: unknown, path: string): string | undefined {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, dict) as string | undefined
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key]) : `{${key}}`,
  )
}

export function useI18n() {
  const locale = computed(() => currentLocale.value)

  const t = (path: string, params?: Record<string, string | number>): string => {
    const template = resolvePath(commonByLocale[currentLocale.value], path) ?? path
    return interpolate(template, params)
  }

  const getAnalysisField = (key: string): LocalizedField => {
    const dict = analysisFieldsByLocale[currentLocale.value]
    return dict[key] ?? { name: key, description: '' }
  }

  return {
    locale,
    setLocale,
    t,
    getAnalysisField,
  }
}
