import { computed, unref } from 'vue'
import type { PvTableMethod } from './usePvTableMethod'
import type { PvTableState } from './usePvTableState'
import { isEmpty } from 'lodash-es'
import type { Field, PvFormProps } from '@/components/basic/pvForm'

export type UsePvTableForm = {
  tableState: PvTableState
  tableMethod: PvTableMethod
}

export const usePvTableForm = ({ tableState }: UsePvTableForm) => {
  const { getTablePropsRef, tableLoadingRef } = tableState

  const getTableFormFields = computed((): Array<Field> => {
    const { searchFilters } = unref(getTablePropsRef)
    return isEmpty(searchFilters) ? [] : searchFilters!
  })

  const getTableFormConfig = computed((): PvFormProps => {
    return {
      expandNum: 3,
      layout: 'horizontal',
      fields: getTableFormFields.value,
      controlButtonsPreset: {
        confirm: {
          loading: tableLoadingRef.value,
        },
        reset: {
          loading: tableLoadingRef.value,
        },
      },
    }
  })

  return {
    getTableFormConfig,
  }
}

export default usePvTableForm
