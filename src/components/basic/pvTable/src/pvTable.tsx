import { defineComponent, Teleport, type SetupContext } from 'vue'
import { merge, omit } from 'lodash-es'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { PvForm } from '@/components/basic/pvForm'
import PvTableToolbar from './components/pvTableToolbar'
import {
  createPvTableContext,
  usePvTableState,
  usePvTableMethod,
  usePvTableForm,
  type PvTableType,
} from './hooks'
import type { Columns, ColumnSlotBodyScope, PvTableProps } from './type/pvTable'

import {
  dataTableProps,
  dataTablePropKeys,
  pvTableExtraProps,
  pvTableExtraPropKeys,
} from './pvTablePreset' // pvTable预设

export const PvTable = defineComponent(
  (props: PvTableProps, ctx: SetupContext) => {
    const tableState = usePvTableState({
      props: merge({}, dataTableProps, pvTableExtraProps, props),
    })
    const {
      tableRef,
      tableData,
      tableLoadingRef,
      getTablePropsRef,
      paginationRef,
      selectionRef,
      isFullscreenRef,
      columnDisabledRef,
    } = tableState

    const tableMethod = usePvTableMethod({ tableState })
    const { paginationChange, refresh, search } = tableMethod

    const tableForm = usePvTableForm({ tableState, tableMethod })
    const { getTableFormConfig } = tableForm

    const tableContext: PvTableType = {} as PvTableType
    Object.assign(tableContext, {
      ...tableState,
      ...tableMethod,
    })

    createPvTableContext(tableContext)
    ctx.expose(tableContext)

    return () => (
      <Teleport to="body" disabled={!isFullscreenRef.value}>
        <DataTable
          ref={tableRef}
          {...omit(getTablePropsRef.value, pvTableExtraPropKeys)}
          {...{ ...paginationRef.value, selection: selectionRef.value }}
          {...{
            onPage: paginationChange,
            'onUpdate:selection': (val: Array<object>) => (selectionRef.value = val),
          }}
          value={tableData.value}
          loading={tableLoadingRef.value}
          v-slots={{
            header: () => (
              <div class="flex flex-col gap-4">
                <PvForm
                  {...{
                    ...getTableFormConfig.value,
                    onConfirm: (formModel: Recordable) => search({ formModel }),
                    onCancel: () => search({}),
                  }}
                />
                <PvTableToolbar
                  v-slots={{
                    start: getTablePropsRef.value.tableToolbar?.start,
                    center: getTablePropsRef.value.tableToolbar?.center,
                    end: getTablePropsRef.value.tableToolbar?.end,
                  }}
                />
              </div>
            ),
            empty: () => <>No data here.</>,
          }}
        >
          {getTablePropsRef.value.columns.map((column: Columns) => {
            let slot = {}
            if (column?.render) {
              slot = {
                body: (slotsProps: ColumnSlotBodyScope) =>
                  column.render?.({
                    scope: slotsProps,
                    context: { refresh },
                    disabled: columnDisabledRef.value,
                  }),
              }
            } else if (column.props?.field) {
              slot = {
                body: (slotsProps: ColumnSlotBodyScope) => (
                  <div>{slotsProps.data[column.props.field as string]}</div>
                ),
              }
            }

            return <Column {...column.props}>{slot}</Column>
          })}
        </DataTable>
      </Teleport>
    )
  },
  {
    name: 'PvTable',
    props: [...dataTablePropKeys, ...pvTableExtraPropKeys],
  },
)

export default PvTable
