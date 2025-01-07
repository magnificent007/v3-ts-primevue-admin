import { Button } from 'primevue'
import { PvForm } from '@/components/basic/pvForm'
import dialog from '@/composables/dialogService'
import toast from '@/composables/toastService'
import { deleteChapter, GetPageList, operateChapter } from '@/api'
import type { PvTableProps } from '@/components/basic/pvTable'

export const tableConfig: PvTableProps = {
  tableName: '章管理',
  columns: [
    {
      props: {
        header: '章节名称',
        field: 'chapterName',
        style: { minWidth: '12.5rem' },
      },
    },
    {
      props: {
        header: '说明',
        field: 'description',
        style: { minWidth: '12.5rem' },
      },
    },
    {
      props: {
        header: '操作',
        frozen: true,
        style: { minWidth: '12.5rem' },
      },
      render: ({ scope, context, disabled }) => {
        return (
          <div>
            <Button
              class="mr-4"
              size="small"
              label="删除"
              severity="secondary"
              disabled={disabled}
              onClick={() => {
                const dialogInstance = dialog.open(
                  <span>
                    确认删除 <strong>{scope.data.chapterName}</strong> 章节？
                  </span>,
                  {
                    props: {
                      header: '删除',
                      modal: true,
                      maximizable: true,
                      contentClass: 'w-sm',
                    },
                    templates: {
                      footer: (
                        <div class="flex justify-end gap-2">
                          <Button
                            icon="pi pi-undo"
                            type="button"
                            label="取消"
                            severity="secondary"
                            onClick={() => dialogInstance.close()}
                          />
                          <Button
                            icon="pi pi-check"
                            type="button"
                            label="确定"
                            onClick={async () => {
                              const res = await deleteChapter('/api/Base/Chapter', {
                                data: {
                                  pid: scope.data.pid,
                                },
                              })
                              if (res.data.state) {
                                toast.add({
                                  severity: 'success',
                                  summary: '',
                                  detail: '删除成功',
                                  life: 1500,
                                })
                                dialogInstance.close()
                                context.refresh()
                              }
                            }}
                          />
                        </div>
                      ),
                    },
                  },
                )
              }}
            />
            <Button
              size="small"
              label="编辑"
              disabled={disabled}
              onClick={() => {
                const dialogInstance = dialog.open(
                  <PvForm
                    initialValues={{
                      chapterName: scope.data.chapterName,
                      description: scope.data.description,
                      idx: scope.data.idx,
                    }}
                    fields={[
                      {
                        header: '章节名称',
                        field: 'chapterName',
                        component: 'InputText',
                        componentProps: {
                          InputText: {
                            placeholder: '请输入章节名称',
                          },
                        },
                      },
                      {
                        header: '章节说明',
                        field: 'description',
                        component: 'Textarea',
                        componentProps: {
                          Textarea: {
                            placeholder: '请输入章节说明',
                            fluid: true,
                          },
                        },
                      },
                      {
                        header: '章节排序',
                        field: 'idx',
                        component: 'InputNumber',
                        componentProps: {
                          InputNumber: {
                            placeholder: '请输入章节顺序',
                          },
                        },
                      },
                    ]}
                    {...{
                      onConfirm: async (formModel: Recordable) => {
                        const res = await operateChapter('/api/Base/Chapter', {
                          data: Object.assign(scope.data, formModel),
                        })
                        if (res.data.state) {
                          toast.add({
                            severity: 'success',
                            summary: '',
                            detail: '编辑成功',
                            life: 1500,
                          })
                          dialogInstance.close()
                          context.refresh()
                        }
                      },
                      onCancel: () => {
                        dialogInstance.close()
                      },
                    }}
                  />,
                  {
                    props: {
                      header: '编辑',
                      modal: true,
                      maximizable: true,
                      contentClass: 'w-sm',
                    },
                  },
                )
              }}
            />
          </div>
        )
      },
    },
  ],
  searchFilters: [
    {
      header: '章节名称',
      field: 'chapterName',
      component: 'InputText',
      componentProps: {
        InputText: {
          placeholder: '请输入章节名称',
        },
      },
    },
  ],
  newAdd: {
    show: true,
    render: (context) => {
      const dialogInstance = dialog.open(
        <PvForm
          fields={[
            {
              header: '章节名称',
              field: 'chapterName',
              component: 'InputText',
              componentProps: {
                InputText: {
                  placeholder: '请输入章节名称',
                },
              },
            },
            {
              header: '章节说明',
              field: 'description',
              component: 'Textarea',
              componentProps: {
                Textarea: {
                  placeholder: '请输入章节说明',
                  fluid: true,
                },
              },
            },
            {
              header: '章节排序',
              field: 'idx',
              component: 'InputNumber',
              componentProps: {
                InputNumber: {
                  placeholder: '请输入章节顺序',
                },
              },
            },
          ]}
          {...{
            onConfirm: async (formModel: Recordable) => {
              const res = await operateChapter('/api/Base/Chapter', {
                data: formModel,
              })
              if (res.data.state) {
                toast.add({ severity: 'success', summary: '', detail: '编辑成功', life: 1500 })
                dialogInstance.close()
                context.refresh()
              }
            },
            onCancel: () => {
              dialogInstance.close()
            },
          }}
        />,
        {
          props: {
            header: '新增',
            modal: true,
            maximizable: true,
            contentClass: 'w-sm',
          },
        },
      )
    },
  },
  remoteRequest: GetPageList,
  remoteRequestRoute: '/api/Base/Chapter',
  remoteRequestParams: {
    data: {
      chapterName: '',
      pageNum: 1,
      pageSize: 10,
      status: null,
    },
  },
}

export default tableConfig
