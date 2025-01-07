// 表单预设
import type { FormProps } from '@primevue/forms'
import type { PvFormExtraProps } from './type/pvForm'

// form 预设
export const dataFormProps: FormProps = {
  initialValues: {},
}
export const dataFormPropKeys = Object.keys(dataFormProps) as (keyof FormProps)[]

// 自定义预设
export const pvFormExtraProps: PvFormExtraProps = {
  layout: 'vertical',
  fields: [],
  expandNum: 3,
  expand: false,
  controlButtonsPreset: {
    confirm: {
      loading: false,
    },
    reset: {
      loading: false,
    },
  },
  confirmRequest: null,
  confirmRequestRoute: null,
  confirmRequestParams: null,
  resetRequest: null,
  resetRequestRoute: null,
  resetRequestParams: null,
}
export const pvFormExtraPropKeys = Object.keys(pvFormExtraProps) as (keyof PvFormExtraProps)[]
