import { unref, type SetupContext } from 'vue'
import { isFunction, debounce } from 'lodash-es'
import PvFormItem from '../pvFormItem'
import type { PvFormMethod } from './usePvFormMethod'
import type { PvFormState } from './usePvFormState'
import type { PvFormEmits } from '../type/pvForm'

export type UsePvFormEvent = {
  formState: PvFormState
  formMethod: PvFormMethod
  emit: SetupContext<PvFormEmits>['emit']
}

export const usePvFormEvent = ({ formState, emit }: UsePvFormEvent) => {
  const { getFormPropsRef, formModelRef, defaultFormModelRef } = formState

  const confirm = debounce(async function (valid?: boolean) {
    let requestStatus = true
    const { confirmRequest, confirmRequestRoute, confirmRequestParams } = unref(getFormPropsRef)
    if (valid && confirmRequest && isFunction(confirmRequest)) {
      let res: Recordable | undefined
      if (!confirmRequestRoute)
        res = await confirmRequest({
          data: Object.assign({}, confirmRequestParams, formModelRef.value),
        })
      else
        res = await confirmRequest(confirmRequestRoute, {
          data: Object.assign({}, confirmRequestParams, formModelRef.value),
        })
      if (!res) {
        requestStatus = false
      }
    }
    if (requestStatus && valid) emit('confirm', formModelRef.value)
  }, 300)

  const cancel = debounce(async function (
    formItemInstances?: Array<InstanceType<typeof PvFormItem>>,
  ) {
    const { resetRequest, resetRequestRoute, resetRequestParams } = unref(getFormPropsRef)

    Object.keys(formModelRef.value).forEach((key: string) => {
      formModelRef.value[key] = defaultFormModelRef.value[key] ?? ''
    })

    if (resetRequest && isFunction(resetRequest)) {
      if (!resetRequestRoute)
        await resetRequest({ data: Object.assign({}, resetRequestParams, formModelRef.value) })
      else
        await resetRequest(resetRequestRoute, {
          data: Object.assign({}, resetRequestParams, formModelRef.value),
        })
    }

    emit('cancel', formModelRef.value)

    if (formItemInstances && formItemInstances.length)
      formItemInstances.forEach(async (i) => {
        await i.$.exposed!.fetchDropdownOptions()
      })
  }, 300)

  /**
   * 无法通过enter回车进行确认 form的valid校验状态通过submit事件接收 自定义keyup事件无法获取valid状态
   * 待解决..
   * @param e KeyboardEvent 键盘事件
   */
  function handleEnterPress(e: KeyboardEvent) {
    if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
      const target: HTMLElement = e.target as HTMLElement
      if (target && target.tagName && target.tagName.toUpperCase() == 'INPUT') {
        e?.preventDefault()
        confirm()
      }
    }
  }

  return {
    confirm,
    cancel,
    handleEnterPress,
  }
}

export default usePvFormEvent

export type PvFormEvent = ReturnType<typeof usePvFormEvent>
