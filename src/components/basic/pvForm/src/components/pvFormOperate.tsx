import { computed, defineComponent, type PropType } from 'vue'
import { usePvFormContext } from '../hooks'
import { Button } from 'primevue'
import type { ControlButtonsPreset } from '../type/pvForm'

type PvFormOperateType = {
  controlButtonsPreset: ControlButtonsPreset
}

export const PvFormOperate = defineComponent(
  (props: PvFormOperateType) => {
    const pvFormInstance = usePvFormContext()
    const { getFieldsLengthRef, getFormPropsRef } = pvFormInstance

    const isShowExpand = computed(() => {
      const fieldsLen = getFieldsLengthRef.value
      const { expandNum } = getFormPropsRef.value
      return expandNum! < fieldsLen ? true : false
    })

    const isExpand = computed(() => {
      const { expand } = getFormPropsRef.value
      return expand
    })

    const confirmButtonProps = computed(() => {
      const { confirm } = props.controlButtonsPreset
      if (confirm) {
        return confirm
      }
      return {}
    })

    const resetButtonProps = computed(() => {
      const { reset } = props.controlButtonsPreset
      if (reset) return reset
      return {}
    })

    return () => (
      <div class="flex flex-wrap justify-end items-center gap-2">
        {isShowExpand.value ? (
          <>
            {isExpand.value ? (
              <Button
                label="折叠"
                icon="pi pi-angle-up"
                variant="link"
                onClick={() => pvFormInstance.setExpand(false)}
              />
            ) : (
              <Button
                label="展开"
                icon="pi pi-angle-down"
                variant="link"
                onClick={() => pvFormInstance.setExpand(true)}
              />
            )}
          </>
        ) : (
          <></>
        )}
        <Button type="reset" label="取消" icon="pi pi-undo" {...resetButtonProps.value} />
        <Button type="submit" label="确定" icon="pi pi-check" {...confirmButtonProps.value} />
      </div>
    )
  },
  {
    name: 'PvFormOperate',
    props: {
      controlButtonsPreset: {
        type: Object as PropType<ControlButtonsPreset>,
      },
    },
  },
)

export default PvFormOperate
