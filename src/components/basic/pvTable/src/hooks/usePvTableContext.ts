import { provide, inject } from 'vue'
import type { PvTableType } from '.'

const pvTableInstanceKey = Symbol('pvTableInstance')

export function createPvTableContext(context: PvTableType) {
  provide(pvTableInstanceKey, context)
}

export function usePvTableContext() {
  return inject(pvTableInstanceKey, {} as PvTableType)
}
