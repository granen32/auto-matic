import type {
  AnalysisFieldRaw,
  LocalizedAnalysisField,
} from '../types/analysis-field.types'
import type { LocalizedField } from '@/shared/i18n/use-i18n'

/**
 * 분석 필드 i18n 사전 조회 함수.
 * (보통 `useI18n().getAnalysisField` 가 그대로 들어온다)
 */
export type AnalysisFieldLookup = (key: string) => LocalizedField

interface MapOptions {
  /** 기본 체크 여부 */
  defaultChecked?: boolean
  /** 기본으로 체크 해제할 키 목록 */
  uncheckedKeys?: readonly string[]
}

/**
 * API 응답으로 받은 분석 필드 목록(`AnalysisFieldRaw[]`)을
 * 화면 렌더링용 `LocalizedAnalysisField[]`로 변환한다.
 *
 * 데이터 흐름:
 *   API 응답 (key + 원본 label)
 *     → i18n 사전 조회로 name / description 채움
 *     → 사전에 없는 키는 API label을 fallback으로 사용
 *     → 화면용 view model
 *
 * **출력 목록은 입력 목록의 순서와 길이를 그대로 따른다.**
 * 즉, API가 `DOC_ID` 하나만 보내면 결과도 1건이고,
 * 사전에 100개가 있어도 화면에는 1건만 표시된다.
 *
 * 사전에 키가 없을 경우:
 *   - name → API의 label (없으면 key 자체)
 *   - description → 빈 문자열
 */
export function toLocalizedAnalysisFields(
  rawFields: readonly AnalysisFieldRaw[] | undefined,
  lookup: AnalysisFieldLookup,
  options: MapOptions = {},
): LocalizedAnalysisField[] {
  if (!rawFields || rawFields.length === 0) return []

  const { defaultChecked = true, uncheckedKeys = [] } = options
  const uncheckedSet = new Set(uncheckedKeys)

  return rawFields.map((item) => {
    const i18n = lookup(item.key)
    return {
      key: item.key,
      name: i18n.name || item.label || item.key,
      description: i18n.description,
      checked: defaultChecked && !uncheckedSet.has(item.key),
    }
  })
}
