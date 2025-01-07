import type {
  AllowedComponentProps,
  ComponentCustomProps,
  ExtractPublicPropTypes,
  VNodeProps,
} from 'vue'

// form表单可能需要的组件
import {
  AutoComplete,
  CascadeSelect,
  Checkbox,
  ColorPicker,
  DatePicker,
  InputMask,
  InputNumber,
  InputOtp,
  InputText,
  Knob,
  Listbox,
  MultiSelect,
  Password,
  RadioButton,
  Rating,
  Select,
  SelectButton,
  Slider,
  Textarea,
  ToggleButton,
  TreeSelect,
} from 'primevue'

export const componentMap = {
  AutoComplete,
  CascadeSelect,
  Checkbox,
  ColorPicker,
  DatePicker,
  InputMask,
  InputNumber,
  InputOtp,
  InputText,
  Knob,
  Listbox,
  MultiSelect,
  Password,
  RadioButton,
  Rating,
  Select,
  SelectButton,
  Slider,
  Textarea,
  ToggleButton,
  TreeSelect,
}

export default componentMap

export type ComponentMapKeys = keyof typeof componentMap
export type ComponentMapProps = {
  [key in ComponentMapKeys]: Omit<
    ExtractPublicPropTypes<InstanceType<(typeof componentMap)[key]>['$props']>,
    keyof VNodeProps | keyof AllowedComponentProps | keyof ComponentCustomProps
  >
}
export type ComponentMapPropValues = ComponentMapProps[ComponentMapKeys]
