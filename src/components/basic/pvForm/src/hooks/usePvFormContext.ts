import { provide, inject } from 'vue'
import type { PvFormType } from '.'

const pvFormInstanceKey = Symbol('pvFormInstance')

export function createPvFormContext(context: PvFormType) {
  provide(pvFormInstanceKey, context)
}

export function usePvFormContext() {
  return inject(pvFormInstanceKey, {} as PvFormType)
}
