import { defineComponent, ref } from 'vue'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import { useDialog } from 'primevue/usedialog'
import dialog from '@/composables/dialogService'
import toast from '@/composables/toastService'
import type { TableRowContext } from '@/components/basic/pvTable'
import type { JSX } from 'vue/jsx-runtime'

export class ReviewAction {
  dialog: ReturnType<typeof useDialog>
  constructor() {
    this.dialog = dialog
  }

  singlePass({ scope, context }: Partial<TableRowContext>) {
    if (scope && context)
      this.pass(`是否通过家长${scope.data.parentsName}的加入？`, scope.data.pid, () =>
        context.refresh(),
      )
  }

  pass(content: string, ids: string, success: () => void) {
    const dialogInstance = this.dialog.open(<span>{content}</span>, {
      props: {
        header: '审核',
        modal: true,
        maximizable: true,
        contentClass: 'w-sm',
      },
      templates: {
        footer: (
          <div class="flex justify-end gap-2">
            <Button
              type="button"
              label="取消"
              severity="secondary"
              onClick={() => dialogInstance.close()}
            />
            <Button
              type="button"
              label="确定"
              onClick={async () => {
                const res = await AuditOperate('/api/Base/BindStudent', {
                  data: {
                    pid: ids,
                    isAgree: 1,
                    refuseReason: '',
                  },
                })
                if (res.data.state) {
                  toast.add({ severity: 'success', summary: '', detail: '审核成功', life: 3000 })
                  dialogInstance.close()
                  success()
                }
              }}
            />
          </div>
        ),
      },
    })
  }

  singleDeny({ scope, context }: Partial<TableRowContext>) {
    if (scope && context)
      this.deny(`请填写拒绝家长${scope.data.parentsName}加入的原因`, scope.data.pid, () =>
        context.refresh(),
      )
  }

  deny(content: string, ids: string, success: () => void) {
    const refuseReason = ref<string>('')

    const dialogInstance = this.dialog.open(
      <>
        <div class="mb-2">{content}</div>
        <Textarea
          {...{
            value: refuseReason.value,
            'onUpdate:value': (value: string) => (refuseReason.value = value),
            fluid: true,
          }}
        />
      </>,
      {
        props: {
          header: '审核',
          modal: true,
          maximizable: true,
          contentClass: 'w-sm',
        },
        templates: {
          footer: (
            <div class="flex justify-end gap-2">
              <Button
                type="button"
                label="取消"
                severity="secondary"
                onClick={() => dialogInstance.close()}
              ></Button>
              <Button
                type="button"
                label="确定"
                onClick={async () => {
                  if (!refuseReason.value) {
                    toast.add({
                      severity: 'warn',
                      summary: '',
                      detail: '请填写拒绝理由',
                      life: 3000,
                    })
                    return
                  }
                  const res = await AuditOperate('/api/Base/BindStudent', {
                    data: {
                      pid: ids,
                      isAgree: 2,
                      refuseReason: refuseReason.value,
                    },
                  })
                  if (res.data.state) {
                    toast.add({ severity: 'success', summary: '', detail: '审核成功', life: 3000 })
                    dialogInstance.close()
                    success()
                  } else {
                    toast.add({ severity: 'error', summary: '', detail: '审核失败', life: 3000 })
                  }
                }}
              ></Button>
            </div>
          ),
        },
      },
    )
  }

  failureReason({ scope }: Partial<TableRowContext>) {
    if (scope) {
      this.dialog.open(<span>{scope.data.failReason}</span>, {
        props: {
          header: '拒绝原因',
          modal: true,
          maximizable: true,
          contentClass: 'w-sm',
        },
      })
    }
  }
}
const reviewAction = new ReviewAction()

export class ReviewStrategy {
  constructor() {}

  strategy: ({ scope, context, disabled }: TableRowContext) => JSX.Element = () => <></>
  strategies: Record<
    's1' | 's2' | 's3',
    ({ scope, context, disabled }: TableRowContext) => JSX.Element
  > = {
    s1: ({ scope, context, disabled }) => (
      <div class="flex gap-2">
        <Button
          {...{
            label: '通过',
            severity: 'success',
            onClick: () => reviewAction.singlePass({ scope, context }),
            autofocus: true,
            size: 'small',
            outlined: true,
            disabled,
          }}
        />
        <Button
          {...{
            label: '拒绝',
            severity: 'danger',
            onClick: () => reviewAction.singleDeny({ scope, context }),
            autofocus: true,
            size: 'small',
            outlined: true,
            disabled,
          }}
        />
      </div>
    ),
    s2: () => <div></div>,
    s3: ({ scope, disabled }) => (
      <Button
        {...{
          label: '拒绝原因',
          severity: 'secondary',
          onClick: () => reviewAction.failureReason({ scope }),
          autofocus: true,
          size: 'small',
          outlined: true,
          disabled,
        }}
      />
    ),
  }

  setStrategy(strategy: ({ scope, context, disabled }: TableRowContext) => JSX.Element) {
    this.strategy = strategy
  }

  executeStrategy({ scope, context, disabled }: TableRowContext) {
    return this.strategy({ scope, context, disabled })
  }
}

export const PvReview = defineComponent(
  (props, ctx) => {
    return () => <>{ctx.slots.default?.()}</>
  },
  {
    name: 'PvReview',
  },
)

export default PvReview
