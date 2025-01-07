import { nextTick, ref, unref, watch, type FunctionalComponent } from 'vue'
import { isEmpty } from 'lodash-es'
import PvTable from '../pvTable.tsx'
import type { PvTableProps } from '../type/pvTable.ts'

type PvTableType = InstanceType<typeof PvTable>

export function useTable(props: PvTableProps) {
  const tableRef = ref<PvTableType>({} as PvTableType)

  async function getTableInstance() {
    await nextTick()
    const table = unref(tableRef)
    if (isEmpty(table)) {
      console.error('表格实例不存在')
    }
    return table
  }

  watch(
    () => props,
    async () => {
      if (props) {
        await nextTick()
        await getTableInstance()
      }
    },
    {
      deep: true,
      immediate: true,
      flush: 'post',
    },
  )

  const TableView: FunctionalComponent<Partial<PvTableProps>> = (compProps, { attrs, slots }) => {
    return (
      <PvTable ref={tableRef} {...{ ...props, ...attrs, ...compProps }} v-slots={slots}></PvTable>
    )
  }

  return {
    TableView,
  }
}

export default useTable
