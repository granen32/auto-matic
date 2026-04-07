import { computed, reactive, ref, watch } from 'vue'

import { useAnalysisFieldsController } from './use-analysis-fields.controller'
import type {
  AnalysisFieldGroup,
  LocalizedAnalysisField,
} from '../types/analysis-field.types'
import type { DownloadFieldGroup } from '@/shared/types/download-field.types'

const STORAGE_KEY = 'v2v-download-selection'
const ALL_GROUPS: AnalysisFieldGroup[] = ['general', 'advanced']
const GROUP_TITLE_KEYS: Record<AnalysisFieldGroup, string> = {
  general: 'download.general',
  advanced: 'download.advanced',
}

type StoredSelection = Partial<Record<AnalysisFieldGroup, string[]>>

function isAnalysisFieldGroup(value: string): value is AnalysisFieldGroup {
  return value === 'general' || value === 'advanced'
}

function loadSavedSelection(): StoredSelection {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object') return parsed as StoredSelection
  } catch {
    /* noop */
  }
  return {}
}

function saveSelection(selection: StoredSelection) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
}

export function useV2vDownloadController() {
  const { generalFields, advancedFields, isLoading } = useAnalysisFieldsController()

  const isModalOpen = ref(false)
  const activeGroupId = ref<AnalysisFieldGroup>('general')

  const fieldsByGroup: Record<AnalysisFieldGroup, typeof generalFields> = {
    general: generalFields,
    advanced: advancedFields,
  }

  /** 그룹별 선택된 키 집합 */
  const checkedKeys = reactive<Record<AnalysisFieldGroup, Set<string>>>({
    general: new Set<string>(),
    advanced: new Set<string>(),
  })

  const initializedGroups = new Set<AnalysisFieldGroup>()

  // 데이터 로딩 후 초기 선택값 세팅 (localStorage 우선, 없으면 기본 checked)
  watch(
    [generalFields, advancedFields],
    () => {
      const saved = loadSavedSelection()

      for (const groupId of ALL_GROUPS) {
        if (initializedGroups.has(groupId)) continue
        const list = fieldsByGroup[groupId].value
        if (list.length === 0) continue

        const savedKeys = saved[groupId]
        const set = checkedKeys[groupId]
        if (savedKeys) {
          savedKeys.forEach((k) => set.add(k))
        } else {
          list.forEach((f) => f.checked && set.add(f.key))
        }
        initializedGroups.add(groupId)
      }
    },
    { immediate: true },
  )

  function applyChecked(
    list: LocalizedAnalysisField[],
    groupId: AnalysisFieldGroup,
  ): LocalizedAnalysisField[] {
    const set = checkedKeys[groupId]
    return list.map((f) => ({ ...f, checked: set.has(f.key) }))
  }

  const groups = computed<DownloadFieldGroup[]>(() =>
    ALL_GROUPS.map((groupId) => ({
      id: groupId,
      titleKey: GROUP_TITLE_KEYS[groupId],
      fields: applyChecked(fieldsByGroup[groupId].value, groupId),
    })),
  )

  const isDownloadable = computed(() =>
    ALL_GROUPS.some((g) => checkedKeys[g].size > 0),
  )

  function openModal() {
    isModalOpen.value = true
  }
  function closeModal() {
    isModalOpen.value = false
  }

  function changeGroup(groupId: string) {
    if (isAnalysisFieldGroup(groupId)) activeGroupId.value = groupId
  }

  function toggleField(groupId: string, key: string) {
    if (!isAnalysisFieldGroup(groupId)) return
    const set = checkedKeys[groupId]
    if (set.has(key)) set.delete(key)
    else set.add(key)
  }

  function toggleAll(groupId: string) {
    if (!isAnalysisFieldGroup(groupId)) return
    const set = checkedKeys[groupId]
    const list = fieldsByGroup[groupId].value
    const allSelected = list.length > 0 && list.every((f) => set.has(f.key))
    if (allSelected) {
      set.clear()
    } else {
      list.forEach((f) => set.add(f.key))
    }
  }

  function getSelectedKeys(): Record<AnalysisFieldGroup, string[]> {
    return {
      general: Array.from(checkedKeys.general),
      advanced: Array.from(checkedKeys.advanced),
    }
  }

  function handleDownload() {
    const selected = getSelectedKeys()
    saveSelection(selected)
    closeModal()
    // TODO: selected 키들을 payload에 담아 다운로드 API 호출
    return selected
  }

  return {
    isLoading,
    isModalOpen,
    activeGroupId,
    groups,
    isDownloadable,
    openModal,
    closeModal,
    changeGroup,
    toggleField,
    toggleAll,
    handleDownload,
  }
}
