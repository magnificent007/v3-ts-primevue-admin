import { computed, ref, unref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { PvFormProps } from '../type/pvForm'

export type UsePvFormStateParams = {
  props: PvFormProps
}

export const usePvFormState = ({ props }: UsePvFormStateParams) => {
  const formItemInstancesRef = ref<Array<any>>([]) // 字段组件引用 类型待完善..
  const formPropsRef = ref<PvFormProps>(cloneDeep(props)) // 表单配置 要注意深拷贝，否则还是引用同个props，折叠时fields会发生错乱
  const formModelRef = ref<Recordable>({ ...props.initialValues }) // 输入数据源
  const defaultFormModelRef = ref<Recordable>({ ...props.initialValues }) // 表单默认值，用于取消

  const getFormPropsRef = computed(() => {
    return {
      ...unref(formPropsRef),
    } as PvFormProps
  })

  const getFieldsLengthRef = computed(() => {
    const { fields } = getFormPropsRef.value
    return fields ? fields.length : 0
  })

  const getFormLayoutRef = computed(() => {
    const { layout } = getFormPropsRef.value
    let _layout = 3
    switch (layout) {
      case 'horizontal':
        _layout = 3
        break
      case 'vertical':
        _layout = 1
        break
      default: {
      }
    }
    return _layout
  })

  return {
    formItemInstancesRef,
    formPropsRef,
    formModelRef,
    defaultFormModelRef,
    getFormPropsRef,
    getFieldsLengthRef,
    getFormLayoutRef,
  }
}

export default usePvFormState

export type PvFormState = ReturnType<typeof usePvFormState>
