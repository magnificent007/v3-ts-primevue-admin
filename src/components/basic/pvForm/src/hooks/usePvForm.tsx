import { nextTick, ref, unref, watch, type FunctionalComponent } from 'vue'
import { isEmpty } from 'lodash-es'
import PvForm from '../pvForm.tsx'
import type { PvFormProps, PvFormEmits } from '../type/pvForm.ts'

type PvFormInstance = InstanceType<typeof PvForm>

export function usePvForm(props: PvFormProps) {
  const formRef = ref<PvFormInstance>({} as PvFormInstance)

  async function getFormInstance() {
    await nextTick()
    const form = unref(formRef)
    if (isEmpty(form)) {
      console.error('表单实例不存在')
    }
    return form
  }

  watch(
    () => props,
    async () => {
      if (props) {
        await nextTick()
        await getFormInstance()
      }
    },
    {
      deep: true,
      immediate: true,
      flush: 'post',
    },
  )

  const FormView: FunctionalComponent<Partial<PvFormProps>, Partial<PvFormEmits>> = (
    compProps,
    { attrs, slots },
  ) => {
    return <PvForm ref={formRef} {...{ ...props, ...attrs, ...compProps }} v-slots={slots}></PvForm>
  }

  return {
    FormView,
  }
}

export default usePvForm
