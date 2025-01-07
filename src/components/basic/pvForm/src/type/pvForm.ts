import type { FormProps } from '@primevue/forms'
import type { ButtonProps } from 'primevue'
import type { PassThroughOptions } from 'primevue/passthrough'
import type { ComponentMapKeys, ComponentMapProps } from '../componetMap'
import type { ApiOptions } from '@/utils/request/request'

export type Field = {
  header: string
  field: string
  component: ComponentMapKeys
  componentProps?: Partial<ComponentMapProps>
  remoteRequest?: any | null | undefined
  remoteRequestRoute?: string | null | undefined
  remoteRequestParams?: ApiOptions | null | undefined
  eventBus?:
    | {
        emit?: { event: string; value: string }
        on?: string
      }
    | null
    | undefined
}

export type ControlButtonsPreset = Record<'confirm' | 'reset', ButtonProps>

export interface PvFormExtraProps {
  layout?: 'horizontal' | 'vertical'
  fields: Array<Field> // 表单字段
  expandNum?: number
  expand?: boolean
  controlButtonsPreset?: ControlButtonsPreset
  confirmRequest?: any | null | undefined
  confirmRequestRoute?: string | null | undefined
  confirmRequestParams?: ApiOptions | null | undefined
  resetRequest?: any | null | undefined
  resetRequestRoute?: string | null | undefined
  resetRequestParams?: ApiOptions | null | undefined
}

export type PvFormEmits = {
  cancel(formModel: Recordable): void
  confirm(formModel: Recordable): void
}

export interface PvFormProps extends PvFormExtraProps, FormProps {
  ptOptions?: PassThroughOptions
}
