import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import { fetchAnalysisFields } from '../api/analysis-fields-api'
import { toLocalizedAnalysisFields } from '../lib/analysis-fields-mapper'
import { useI18n } from '@/shared/i18n/use-i18n'

interface Options {
  /** API에 전달할 키 필터 (mock 전용; 실제 API에서는 백엔드가 컨텍스트로 결정) */
  keys?: readonly string[]
  /** 기본 체크 여부 */
  defaultChecked?: boolean
  /** 기본으로 체크 해제할 키 목록 */
  uncheckedKeys?: readonly string[]
}

/**
 * 분석 필드 API 응답을 가져와 i18n 사전과 합쳐
 * 화면용 LocalizedAnalysisField 목록으로 반환한다.
 *
 * 화면에 무엇이 보일지는 **API 응답이 결정**한다.
 * i18n 사전은 단지 name / description을 채워 넣는 enrichment 역할.
 */
export function useAnalysisFieldsController(options: Options = {}) {
  const { keys, defaultChecked = true, uncheckedKeys = [] } = options
  const { getAnalysisField } = useI18n()

  const query = useQuery({
    queryKey: ['analysis-fields', keys ?? null],
    queryFn: () => fetchAnalysisFields({ keys }),
    staleTime: 1000 * 60 * 60,
  })

  const generalFields = computed(() =>
    toLocalizedAnalysisFields(query.data.value?.generalAnalysisFields, getAnalysisField, {
      defaultChecked,
      uncheckedKeys,
    }),
  )

  const advancedFields = computed(() =>
    toLocalizedAnalysisFields(
      query.data.value?.advancedAnalysisFieldsPartial,
      getAnalysisField,
      { defaultChecked, uncheckedKeys },
    ),
  )

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    generalFields,
    advancedFields,
  }
}
