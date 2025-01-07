import type { PvTableExtraProps } from './type/pvTable'
import type { DataTableProps } from 'primevue'

// datatable 预设
export const dataTableProps: DataTableProps = {
  scrollable: true,
  scrollHeight: 'flex',
  lazy: true,
  paginator: true,
  rows: 10,
  first: 0,
  rowsPerPageOptions: [10, 50],
}
export const dataTablePropKeys = Object.keys(dataTableProps) as (keyof DataTableProps)[]

// 自定义预设
export const pvTableExtraProps: PvTableExtraProps = {
  tableName: '',
  tableToolbar: {},
  export: {
    show: false,
  },
  newAdd: {
    show: true,
  },
  columns: [],
  searchFilters: [],
  remoteRequest: null,
  remoteRequestRoute: null,
  remoteRequestParams: null,
}
export const pvTableExtraPropKeys = Object.keys(pvTableExtraProps) as (keyof PvTableExtraProps)[]
