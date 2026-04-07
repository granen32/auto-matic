import type { AnalysisFieldsResponse } from '../types/analysis-field.types'
import mockData from './analysis-fields.mock.json'

/**
 * 분석 필드 목록 조회.
 *
 * 실제 환경에서는 백엔드 API를 호출한다.
 * 현재는 정적 mock JSON을 반환한다 (analysis_fields.json 형태와 동일).
 */
export async function fetchAnalysisFields(): Promise<AnalysisFieldsResponse> {
  return mockData as AnalysisFieldsResponse
}
