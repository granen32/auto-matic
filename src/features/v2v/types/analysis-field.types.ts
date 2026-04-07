import type { DownloadField } from '@/shared/types/download-field.types'

/** API 응답 한 항목 (raw) */
export interface AnalysisFieldRaw {
  key: string
  label: string
}

/** 분석 필드 API 응답 */
export interface AnalysisFieldsResponse {
  generalAnalysisFields: AnalysisFieldRaw[]
  advancedAnalysisFieldsPartial: AnalysisFieldRaw[]
}

/**
 * UI에서 사용하는 다국어 적용된 필드.
 * 다운로드 모달의 DownloadField 모양과 호환된다.
 */
export type LocalizedAnalysisField = DownloadField

export type AnalysisFieldGroup = 'general' | 'advanced'
