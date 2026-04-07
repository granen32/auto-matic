import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import { fetchAnalysisFields } from '../api/analysis-fields-api'
import type {
  AnalysisFieldRaw,
  LocalizedAnalysisField,
} from '../types/analysis-field.types'
import { useI18n } from '@/shared/i18n/use-i18n'

interface Options {
  /** 기본 체크 여부 (다국어 라벨이 매핑되지 않아도 사용) */
  defaultChecked?: boolean
  /** 기본으로 체크 해제할 키 목록 */
  uncheckedKeys?: string[]
}

/**
 * 분석 필드 API 응답을 가져와 i18n 사전과 합쳐
 * 화면용 LocalizedAnalysisField 목록으로 반환한다.
 */
export function useAnalysisFieldsController(options: Options = {}) {
  const { defaultChecked = true, uncheckedKeys = [] } = options
  const { getAnalysisField, locale } = useI18n()

  const query = useQuery({
    queryKey: ['analysis-fields'],
    queryFn: fetchAnalysisFields,
    staleTime: 1000 * 60 * 60,
  })

  function localize(list: AnalysisFieldRaw[] | undefined): LocalizedAnalysisField[] {
    if (!list) return []
    // locale 변경에 반응하기 위해 명시적 참조
    void locale.value
    return list.map((item) => {
      const i18n = getAnalysisField(item.key)
      return {
        key: item.key,
        // i18n 사전에 없으면 API label을 fallback으로 사용
        name: i18n.name || item.label,
        description: i18n.description,
        checked: defaultChecked && !uncheckedKeys.includes(item.key),
      }
    })
  }

  const generalFields = computed(() => localize(query.data.value?.generalAnalysisFields))
  const advancedFields = computed(() =>
    localize(query.data.value?.advancedAnalysisFieldsPartial),
  )

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    generalFields,
    advancedFields,
  }
}
