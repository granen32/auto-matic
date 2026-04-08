import type {
  AnalysisFieldRaw,
  AnalysisFieldsResponse,
} from '../types/analysis-field.types'
import mockData from './analysis-fields.mock.json'

/**
 * 분석 필드 조회 요청 파라미터.
 *
 * - 백엔드가 컨텍스트별로 응답을 다르게 줄 수 있으므로 확장 여지를 둔다.
 * - `keys`가 주어지면 해당 키에 해당하는 필드만 반환한다 (mock에서만 의미 있음).
 * - 실제 API에서는 권한 / 채널 / 사업부 등에 따라 백엔드가 알아서 필터링한 응답을 내려주므로
 *   프론트가 별도로 추리지 않는다.
 */
export interface FetchAnalysisFieldsParams {
  /** 응답에 포함시킬 키 목록 (mock 전용 필터) */
  keys?: readonly string[]
}

function filterByKeys(
  list: readonly AnalysisFieldRaw[],
  keys: ReadonlySet<string>,
): AnalysisFieldRaw[] {
  return list.filter((item) => keys.has(item.key))
}

/**
 * 분석 필드 목록 조회.
 *
 * **데이터 흐름:**
 *   - 백엔드가 컨텍스트에 맞는 필드 목록 (`{ key, label }[]`)을 내려준다.
 *   - 프론트는 응답에 들어온 키만 화면에 표시한다.
 *   - 화면 표시용 name / description 은 i18n 사전(`shared/i18n/locales/analysis-fields.*.json`)에서 가져온다.
 *
 * 즉 API가 `DOC_ID` 한 건만 응답하면 모달에도 `DOC_ID` 한 건만 보인다.
 *
 * 현재는 정적 mock JSON을 반환하지만, 시그니처는 실제 API와 동일하게 두었다.
 * 실제 fetch로 교체할 때는 본 함수 내부만 바꾸면 된다.
 */
export async function fetchAnalysisFields(
  params: FetchAnalysisFieldsParams = {},
): Promise<AnalysisFieldsResponse> {
  const response = mockData as AnalysisFieldsResponse

  if (!params.keys || params.keys.length === 0) {
    return response
  }

  const keySet = new Set(params.keys)
  return {
    generalAnalysisFields: filterByKeys(response.generalAnalysisFields, keySet),
    advancedAnalysisFieldsPartial: filterByKeys(
      response.advancedAnalysisFieldsPartial,
      keySet,
    ),
  }
}
