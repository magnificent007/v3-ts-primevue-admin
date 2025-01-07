import type { VNode } from 'vue'
import type { Field } from '@/components/basic/pvForm'
import type { ApiOptions } from '@/utils/request/request'
import type { ColumnNode, ColumnProps } from 'primevue/column'
import type { DataTableProps } from 'primevue/datatable'
import type { PvTableToolbarSlots } from './pvTableToolbar'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import type { TableRowContext } from './pvTableRow'

export type ColumnSlotBodyScope = {
  data: any // Row data.
  node: any // Row node data.
  column: ColumnNode // Column node.
  field: string // Column field.
  index: number // Row index.
  frozenRow: boolean // Whether the row is frozen.
  editorInitCallback: (event: Event) => void // Editor init callback function
  rowTogglerCallback: (event: Event) => void // Row toggler callback unction
}

type RenderContextKeys = 'refresh'
export type RenderContext = {
  [x in RenderContextKeys]: () => Promise<void>
}

export type Columns = {
  props: ColumnProps
  render?: ({
    scope,
    context,
  }: TableRowContext) => VNode
}

export interface PvTableExtraProps {
  tableName?: string | VNode
  tableToolbar?: Partial<PvTableToolbarSlots>
  export?: {
    show: boolean
    render?: (context: RenderContext) => VNode | DynamicDialogInstance | void
  }
  newAdd?: {
    show: boolean
    render?: (context: RenderContext) => VNode | DynamicDialogInstance | void
  }
  columns: Array<Columns>
  searchFilters?: Array<Field>
  // 还没想好怎么定义函数类型
  remoteRequest?: any | null | undefined
  remoteRequestRoute?: string | null | undefined
  remoteRequestParams?: ApiOptions | null | undefined
}

export interface PvTableProps extends PvTableExtraProps, DataTableProps {}
