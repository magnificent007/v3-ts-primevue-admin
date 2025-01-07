import { computed, defineComponent, type SetupContext } from 'vue'
import { isEmpty, isUndefined, merge, omit } from 'lodash-es'
import { Form, type FormFieldState } from '@primevue/forms'
import Fluid from 'primevue/fluid'
import PvFormItem from './pvFormItem'
import PvFormOperate from './components/pvFormOperate'
import {
  createPvFormContext,
  usePvFormEvent,
  usePvFormState,
  usePvFormMethod,
  type PvFormType,
} from './hooks'
import {
  dataFormProps,
  dataFormPropKeys,
  pvFormExtraProps,
  pvFormExtraPropKeys,
} from './pvFormPreset'
import $event from '@/composables/eventBus'
import type { PvFormProps, PvFormEmits } from './type/pvForm'

export const PvForm = defineComponent(
  (props: PvFormProps, ctx: SetupContext<PvFormEmits>) => {
    const pvFormProps = computed(() => merge({}, dataFormProps, pvFormExtraProps, props)) // 涉及到函数参数对象引用问题

    const formState = usePvFormState({ props: pvFormProps.value })
    const { formItemInstancesRef, formModelRef, getFormPropsRef, getFormLayoutRef } = formState

    const formMethod = usePvFormMethod({ formState })
    const { setFormModel } = formMethod

    const { confirm, cancel } = usePvFormEvent({
      formState,
      formMethod,
      emit: ctx.emit,
    })

    const formContext: PvFormType = {} as PvFormType
    Object.assign(formContext, {
      ...formState,
      ...formMethod,
    })

    createPvFormContext(formContext)
    ctx.expose(formContext)

    return () => (
      <Form
        class="flex flex-col gap-4 w-full"
        {...omit(getFormPropsRef.value, pvFormExtraPropKeys)}
        {...{
          onSubmit: ({ valid }: { valid: boolean }) => confirm(valid),
          onReset: () => cancel(formItemInstancesRef.value),
        }}
      >
        {{
          default: (scope: FormFieldState) => (
            <>
              <slot name="header"></slot>
              <div class="flex flex-col overflow-y-auto">
                <Fluid>
                  <div
                    class="grid gap-6"
                    style={{ gridTemplateColumns: `repeat(${getFormLayoutRef.value}, 1fr)` }}
                  >
                    {!isUndefined(getFormPropsRef.value?.fields) ||
                    !isEmpty(getFormPropsRef.value?.fields) ? (
                      getFormPropsRef.value.fields.map((field, index) => {
                        return (
                          <>
                            {getFormPropsRef.value.expand ||
                            index < getFormPropsRef.value.expandNum! ? (
                              <PvFormItem
                                ref={(el) => {
                                  if (el && formItemInstancesRef.value.indexOf(el) === -1) {
                                    formItemInstancesRef.value.push(el)
                                  }
                                }}
                                schema={field}
                                formScope={scope}
                                formModel={formModelRef.value}
                                event={$event}
                                {...{
                                  'onUpdate:formModel': setFormModel,
                                }}
                              ></PvFormItem>
                            ) : (
                              <></>
                            )}
                          </>
                        )
                      })
                    ) : (
                      <></>
                    )}
                  </div>
                </Fluid>
              </div>
              <slot name="footer">
                <PvFormOperate controlButtonsPreset={pvFormProps.value['controlButtonsPreset']!} />
              </slot>
            </>
          ),
        }}
      </Form>
    )
  },
  {
    name: 'PvForm',
    props: [...dataFormPropKeys, ...pvFormExtraPropKeys],
  },
)

export default PvForm
