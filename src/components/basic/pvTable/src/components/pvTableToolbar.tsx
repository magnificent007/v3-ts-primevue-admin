import {
  defineComponent,
  resolveDirective,
  withDirectives,
  getCurrentInstance,
  isVNode,
  unref,
  computed,
  type SlotsType,
} from 'vue'
import { isString } from 'lodash-es'
import { Toolbar, Button } from 'primevue'
import dialog from '@/composables/dialogService'
import { usePvTableContext } from '../hooks/usePvTableContext'
import type { PvTableToolbarSlots } from '../type/pvTableToolbar'

export const PvTableToolbar = defineComponent(
  (props, { slots }) => {
    const currentInstance = getCurrentInstance()
    const pvTableContext = usePvTableContext()
    const tooltip = resolveDirective('tooltip')
    const {
      tableLoadingRef,
      isFullscreenRef,
      getTablePropsRef,
      columnDisabledRef,
      refresh,
      expander,
      exportCSV,
    } = pvTableContext

    const updateAppContainerStyle = () => {
      const appContainer: HTMLDivElement =
        currentInstance?.appContext.app._container || document.querySelector('#app')
      appContainer.style.setProperty('opacity', isFullscreenRef.value ? '0' : '1')
      appContainer.style.setProperty('visibility', isFullscreenRef.value ? 'hidden' : 'visible')
      appContainer.style.setProperty('position', isFullscreenRef.value ? 'absolute' : 'relative')
    }

    const getExportPreset = computed(() => {
      return unref(getTablePropsRef).export
    })

    const getNewAddPreset = computed(() => {
      return unref(getTablePropsRef).newAdd
    })

    return () => (
      <Toolbar
        v-slots={{
          start: () => (
            <div class="flex flex-nowrap items-center gap-2">
              {isString(getTablePropsRef.value.tableName) ? (
                <span class="relative inline-block leading-8 max-w-[17rem] pl-3 font-800 before:content-[''] before:block before:absolute before:top-1/2 before:left-0 before:w-2 before:h-2 before:-translate-1/2 before:bg-orange">
                  {getTablePropsRef.value.tableName}
                </span>
              ) : isVNode(getTablePropsRef.value.tableName) ? (
                getTablePropsRef.value.tableName
              ) : (
                <></>
              )}
              {slots?.start ? (
                slots.start({ disabled: columnDisabledRef.value, context: { refresh } })
              ) : (
                <></>
              )}
            </div>
          ),
          center: () => (
            <div>
              {slots?.center ? (
                slots.center({ disabled: columnDisabledRef.value, context: { refresh } })
              ) : (
                <></>
              )}
            </div>
          ),
          end: () => (
            <div class="flex flex-nowrap justify-end items-center gap-2">
              {slots?.end ? (
                slots.end({ disabled: columnDisabledRef.value, context: { refresh } })
              ) : (
                <></>
              )}
              {isFullscreenRef.value
                ? withDirectives(
                    <Button
                      icon="pi pi-window-minimize"
                      severity="secondary"
                      text
                      onClick={() => {
                        expander(false)
                        updateAppContainerStyle()
                      }}
                    />,
                    [[tooltip, '退出全屏', undefined, { bottom: true }]],
                  )
                : withDirectives(
                    <Button
                      icon="pi pi-window-maximize"
                      severity="secondary"
                      text
                      onClick={() => {
                        expander(true)
                        updateAppContainerStyle()
                      }}
                    />,
                    [[tooltip, '进入全屏', undefined, { bottom: true }]],
                  )}
              {withDirectives(
                <>
                  {getExportPreset.value?.show ? (
                    <Button
                      icon="pi pi-download"
                      severity="secondary"
                      text
                      onClick={($event) => exportCSV($event)}
                    />
                  ) : (
                    <></>
                  )}
                </>,
                [[tooltip, '导出表格', undefined, { bottom: true }]],
              )}
              {withDirectives(
                <Button
                  icon="pi pi-refresh"
                  severity="secondary"
                  text
                  loading={tableLoadingRef.value}
                  onClick={refresh}
                />,
                [[tooltip, '刷新', undefined, { bottom: true }]],
              )}
              {withDirectives(
                <>
                  {getNewAddPreset.value?.show ? (
                    <Button
                      icon="pi pi-plus"
                      security="secondary"
                      text
                      onClick={() => {
                        if (getNewAddPreset.value?.render) {
                          getNewAddPreset.value.render({ refresh })
                        } else {
                          const dialogInstance = dialog.open(
                            <span>You need post a component with dialog to replace it.</span>,
                            {
                              props: {
                                header: '新增',
                                modal: true,
                                maximizable: true,
                                contentClass: 'w-sm',
                              },
                              templates: {
                                footer: (
                                  <Button
                                    icon="pi pi-undo"
                                    type="button"
                                    label="取消"
                                    severity="secondary"
                                    onClick={() => dialogInstance.close()}
                                  />
                                ),
                              },
                            },
                          )
                        }
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </>,
                [[tooltip, '新增', undefined, { bottom: true }]],
              )}
            </div>
          ),
        }}
      />
    )
  },
  {
    name: 'pvTableToolbar',
    slots: Object as SlotsType<PvTableToolbarSlots>,
  },
)

export default PvTableToolbar
