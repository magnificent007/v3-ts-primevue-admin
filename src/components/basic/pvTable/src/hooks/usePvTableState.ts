import { computed, ref, watch, type VNodeRef } from 'vue'
import { isEmpty, isObject, cloneDeep } from 'lodash-es'
import { type DataTableProps } from 'primevue/datatable'
import type { PvTableProps } from '../type/pvTable'

export type UsePvTableStateParams = {
  props: PvTableProps
}

export const usePvTableState = ({ props }: UsePvTableStateParams) => {
  const tableRef = ref<VNodeRef | undefined>(undefined)
  const tablePropsRef = ref<PvTableProps>(cloneDeep(props)) // 表格配置
  const tableData = ref<Array<Recordable> | null | undefined>([]) // 表格数据源
  const searchFiltersRef = ref<Recordable>({}) // 表格查找条件
  const tableLoadingRef = ref<boolean>(false)
  const paginationRef = ref<Pick<DataTableProps, 'first' | 'rows' | 'totalRecords'>>({})
  const selectionRef = ref<Array<object>>([]) // 多选集
  const isFullscreenRef = ref<boolean>(false)
  const columnDisabledRef = ref<boolean>(false) // 列禁用

  if (isEmpty(paginationRef.value)) {
    paginationRef.value = {
      first: props.first,
      rows: props.rows,
      totalRecords: props.totalRecords,
    }
  }

  if (isObject(props.remoteRequestParams)) {
    const { remoteRequestParams } = props
    searchFiltersRef.value = remoteRequestParams?.data ?? null
  }

  // 响应式 tablePropsRef
  const getTablePropsRef = computed(() => {
    return { ...tablePropsRef.value } as PvTableProps
  })

  watch(
    () => props.value,
    () => {
      tableData.value = props.value
    },
    {
      deep: true,
      immediate: true,
    },
  )

  /**
   * 本来打算用datatable的emit监听事件，预计双向绑定的值的更新要先于监听事件
   * header全选checkbox监听先于双向绑定
   * 行checkbox双向绑定先于监听
   * 行为不对应，保持代码一致性选择直接watch
   */
  watch(
    () => selectionRef.value,
    () => {
      if (isEmpty(selectionRef.value)) {
        columnDisabledRef.value = false
      } else {
        columnDisabledRef.value = true
      }
    },
  )

  return {
    tableRef,
    tableData,
    tablePropsRef,
    getTablePropsRef,
    searchFiltersRef,
    tableLoadingRef,
    paginationRef,
    selectionRef,
    isFullscreenRef,
    columnDisabledRef,
  }
}

export default usePvTableState

export type PvTableState = ReturnType<typeof usePvTableState>
