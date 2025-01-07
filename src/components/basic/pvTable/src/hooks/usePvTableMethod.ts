import { unref, watch } from 'vue'
import { isEmpty, isFunction, merge, omit, debounce } from 'lodash-es'
import type { DataTablePageEvent } from 'primevue/datatable'
import type { PvTableState } from './usePvTableState'

export type UsePvTableMethod = {
  tableState: PvTableState
}

export const usePvTableMethod = ({ tableState }: UsePvTableMethod) => {
  const {
    tableRef,
    getTablePropsRef,
    tableData,
    searchFiltersRef,
    tableLoadingRef,
    paginationRef,
    isFullscreenRef,
  } = tableState

  async function fetchData(model: Recordable | null | undefined = {}) {
    const { remoteRequest, remoteRequestRoute, remoteRequestParams } = getTablePropsRef.value
    if (!remoteRequest || !isFunction(remoteRequest)) return

    const pagination = unref(paginationRef)

    if (!isEmpty(pagination)) {
      model = {
        ...model,
        pageSize: pagination.rows,
        pageNum: pagination.first! / pagination.rows! + 1,
      }
    }
    const bodyParams = {
      data: remoteRequestParams?.data
        ? {
            ...remoteRequestParams.data,
            ...model,
          }
        : { ...model },
      ...omit(remoteRequestParams, ['data']),
    }

    tableLoadingRef.value = true
    let res: Recordable
    if (!remoteRequestRoute) res = await remoteRequest(bodyParams)
    else res = await remoteRequest(remoteRequestRoute, bodyParams)
    if (!res) return
    if (res.data?.data?.list) {
      tableData.value = res.data.data.list
      updatePagination({ totalRecords: res.data.data.totalcount })
    }
    tableLoadingRef.value = false
  }

  function updatePagination(pagination = paginationRef.value) {
    if (isEmpty(pagination)) {
      paginationRef.value = pagination
    } else {
      paginationRef.value = {
        ...paginationRef.value,
        ...pagination,
      }
    }
  }

  const paginationChange = debounce(async function (event: DataTablePageEvent) {
    const pagination = {
      first: event.first,
      rows: event.rows,
    }
    updatePagination(pagination)
    await fetchData(merge(searchFiltersRef.value, { pageSize: event.rows, pageNum: event.page }))
  }, 300)

  async function refresh() {
    await fetchData(searchFiltersRef.value)
  }

  async function search({
    formModel = getTablePropsRef.value?.remoteRequestParams?.data ?? {},
    page = 0,
  }) {
    updatePagination({
      first: page,
    })
    searchFiltersRef.value = {
      ...searchFiltersRef.value,
      ...formModel,
    }
    await fetchData(searchFiltersRef.value)
  }

  function expander(e: boolean) {
    isFullscreenRef.value = e
  }

  function exportCSV(e) {
    console.log('exportCSV 替换成接口调用 worker多线程')
    // tableRef.value?.exportCSV()
  }

  watch(
    () => getTablePropsRef.value,
    async () => {
      if (isFunction(getTablePropsRef.value.remoteRequest)) await fetchData()
    },
    {
      deep: true,
      immediate: true,
    },
  )

  return {
    fetchData,
    updatePagination,
    paginationChange,
    refresh,
    search,
    expander,
    exportCSV,
  }
}

export default usePvTableMethod

export type PvTableMethod = ReturnType<typeof usePvTableMethod>
