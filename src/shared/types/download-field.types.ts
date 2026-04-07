/**
 * 다운로드 모달이 사용하는 키워드/필드 표시 모델.
 * 어떤 feature에서 와도 동일한 모양으로 모달에 전달한다.
 */
export interface DownloadField {
  key: string
  name: string
  description: string
  checked: boolean
}

/**
 * 모달 탭 단위 그룹.
 * - id: 탭 식별자
 * - titleKey: i18n 키 (`useI18n().t(titleKey)`)
 * - fields: 해당 탭에 보일 필드 목록
 */
export interface DownloadFieldGroup {
  id: string
  titleKey: string
  fields: DownloadField[]
}
