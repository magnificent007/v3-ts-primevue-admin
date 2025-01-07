import {
  computed,
  defineComponent,
  h,
  isVNode,
  onMounted,
  onUnmounted,
  watch,
  type Component,
  type PropType,
  type SetupContext,
  type VNode,
} from 'vue'
import Message from 'primevue/message'
import { isEmpty, isFunction, isObject, isString, merge } from 'lodash-es'
import componentMap, { type ComponentMapKeys, type ComponentMapPropValues } from './componetMap'
import type { Field } from './type/pvForm'
import type { Mitt } from '@/composables/eventBus'

export type PvFormItemProps = {
  schema: Field
  formScope: Recordable
  formModel: Recordable
  event: Mitt | null | undefined
}

type Event = {
  ['update:formModel'](value: Recordable): void
  ['change'](value: string): void
}

export const PvFormItem = defineComponent(
  (props: PvFormItemProps, ctx: SetupContext<Event>) => {
    const { schema, formModel, event } = props

    function vNodeFactory(component: string | VNode) {
      if (isString(component)) {
        return <>{component}</>
      } else if (isVNode(component)) {
        return component
      }
      return component
    }

    const getComponent = computed<Component>(() => {
      const component = schema?.component
      if (!component) {
        console.error('表单选项组件未在配置中定义')
        return <></>
      }
      return isString(component)
        ? (componentMap[component] ?? vNodeFactory(component))
        : vNodeFactory(component)
    })

    const getComponentProps = computed<ComponentMapPropValues>(() => {
      const { component, componentProps } = schema
      if (componentProps) {
        if (!isObject(componentProps)) {
          console.error('表单选项组件属性应为对象属性')
          return {}
        }
        return componentProps[component] ?? {}
      }
      return {}
    })

    const fieldValueType = computed(() => {
      const { component } = schema
      // 判断其他绑定类型示例
      const isChecked = isString(component) && ([] as Array<ComponentMapKeys>).includes(component)

      return {
        true: 'modelValue',
        [`${isChecked}`]: 'checked',
      }['true']
    })

    const getFieldValue = computed(() => {
      return formModel?.[schema.field]
    })

    function setFieldValue(value: string) {
      const fieldList = schema.field.split('.')
      const field = fieldList.pop()!
      const target = fieldList.reduce((prev, field) => (prev[field] ??= {}), props.formModel)
      target[field] = value
      ctx.emit('update:formModel', formModel)
    }

    // 下拉框请求
    async function fetchDropdownOptions(onHintParams = {}) {
      const {
        component,
        componentProps,
        remoteRequest,
        remoteRequestRoute,
        remoteRequestParams,
        eventBus,
      } = schema

      if (remoteRequest && isFunction(remoteRequest)) {
        let options: Array<Recordable> | undefined = []

        // 没有配置eventBus 或 没有on监听
        if (!eventBus || isEmpty(eventBus.on)) {
          let res: Recordable | undefined
          if (!remoteRequestRoute) res = await remoteRequest(remoteRequestParams)
          else res = await remoteRequest(remoteRequestRoute, remoteRequestParams)
          if (res) options = res.data.data.list
        }
        // 有配置eventBus 且 有on监听 且 监听到的值不为空
        else if (eventBus && !isEmpty(eventBus.on) && !isEmpty(onHintParams)) {
          let res: Recordable | undefined
          if (!remoteRequestRoute)
            res = await remoteRequest({
              data: merge({}, remoteRequestParams?.data ?? {}, onHintParams),
            })
          else
            res = await remoteRequest(remoteRequestRoute, {
              data: merge({}, remoteRequestParams?.data ?? {}, onHintParams),
            })
          if (res) options = res.data.data.list
        }

        switch (component) {
          case 'Select':
            {
              if (schema?.componentProps)
                schema.componentProps['Select'] = Object.assign(componentProps?.['Select'] ?? {}, {
                  options,
                })
            }
            break
          default: {
          }
        }
      }
    }

    watch(
      () => schema,
      async () => {
        await fetchDropdownOptions()
      },
      {
        immediate: true,
      },
    )

    onMounted(() => {
      onHint()
    })

    onUnmounted(() => {
      offHint()
    })

    // mitt on监听回调
    async function onHintCallback(val: unknown) {
      const { eventBus } = schema
      // const compProps: Recordable = {}
      // if (isEmpty(val)) {
      //   setFieldValue('')
      //   switch(component) {
      //     case 'Select': {
      //       compProps['options'] = []
      //       schema['componentProps'] = {}
      //       schema.componentProps['Select'] = Object.assign(componentProps?.['Select'] ?? {}, compProps)
      //       return
      //     }
      //   }
      // }

      // let res: Recordable | undefined
      // if (!remoteRequestRoute) res = await remoteRequest({data: merge({}, remoteRequestParams?.data ?? {}, {[`${eventBus.on}`]: val})})
      // else res = await remoteRequest(remoteRequestRoute, merge({}, remoteRequestParams, {data: merge(remoteRequestParams?.data ?? {}, {[`${eventBus.on}`]: val})}))

      // switch(component) {
      //   case 'Select': {
      //     if (res) {
      //       compProps['options'] = res.data.data.list
      //       schema['componentProps'] = {}
      //       schema.componentProps['Select'] = Object.assign(componentProps?.['Select'] ?? {}, compProps)

      //       setFieldValue('')
      //       emitHint()
      //     }
      //   }; break;
      //   default: {}
      // }

      // 只有emit下拉框发生改变时，从第三个下拉框监听on开始可能接收空值情况
      if (isEmpty(val)) {
        await fetchDropdownOptions()
      } else {
        await fetchDropdownOptions({ [`${eventBus!.on}`]: val })
      }
      setFieldValue('')
      emitHint()
    }

    function onHint() {
      const { component, eventBus } = schema
      if (!event || !eventBus || isEmpty(eventBus)) return
      if (['CascadeSelect', 'MultiSelect', 'TreeSelect', 'Select'].includes(component)) {
        if (eventBus?.on) event.on(eventBus.on, onHintCallback)
      }
    }

    function emitHint() {
      const { component, eventBus } = schema
      if (!event || !eventBus || isEmpty(eventBus)) return
      if (['CascadeSelect', 'MultiSelect', 'TreeSelect', 'Select'].includes(component)) {
        if (eventBus?.emit) {
          event.emit(eventBus.emit.event, getFieldValue.value)
        }
      }
    }

    function offHint() {
      const { component, eventBus } = schema
      if (!event || !eventBus || isEmpty(eventBus)) return
      if (['CascadeSelect', 'MultiSelect', 'TreeSelect', 'Select'].includes(component)) {
        if (eventBus?.on) {
          event.off(eventBus.on, onHintCallback)
        }
      }
    }

    ctx.expose({ fetchDropdownOptions })

    return () => (
      <div class="flex items-center gap-2">
        {!isVNode(getComponent.value) ? (
          <>
            <span class="text-nowrap">{schema.header}</span>
            {isEmpty(getComponentProps.value)
              ? h(getComponent.value)
              : h(getComponent.value, {
                  ...getComponentProps.value,
                  [fieldValueType.value]: getFieldValue.value,
                  [`onUpdate:${fieldValueType.value}`]: (value: string) => setFieldValue(value),
                  onChange: () => emitHint(),
                })}
            {props.formScope[schema.field]?.invalid ? (
              <Message severity="error" size="small" variant="simple">
                {props.formScope[schema.field].error?.message}
              </Message>
            ) : (
              <></>
            )}
          </>
        ) : (
          getComponent.value
        )}
      </div>
    )
  },
  {
    name: 'PvFormItem',
    props: {
      schema: {
        type: Object as PropType<Field>,
        default: () => ({}),
      },
      formScope: {
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
      formModel: {
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
      event: {
        type: Object as PropType<Mitt>,
        default: undefined,
      },
    },
  },
)

export default PvFormItem

export type PvFormItemType = InstanceType<typeof PvFormItem>
