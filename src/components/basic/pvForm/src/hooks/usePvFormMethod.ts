import type { PvFormState } from './usePvFormState'

export type UsePvFormMethod = {
  formState: PvFormState
}

export const usePvFormMethod = ({ formState }: UsePvFormMethod) => {
  const { formPropsRef, formModelRef } = formState

  function setExpand(expand: boolean) {
    formPropsRef.value.expand = expand
  }

  function setFormModel(formModel: Recordable) {
    formModelRef.value = formModel
  }

  return {
    setExpand,
    setFormModel,
  }
}

export default usePvFormMethod

export type PvFormMethod = ReturnType<typeof usePvFormMethod>
