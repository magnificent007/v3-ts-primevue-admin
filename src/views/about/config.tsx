import { valibotResolver } from '@primevue/forms/resolvers/valibot'
import * as v from 'valibot'
import { GetPageList, getAuditInfo } from '@/api'
import type { PvFormProps } from '@/components/basic/pvForm'

export const formConfig: PvFormProps = {
  fields: [
    {
      header: '学校名称',
      field: 'schoolName',
      component: 'Select',
      componentProps: {
        Select: {
          placeholder: '请选择学校名称',
          name: 'schoolName',
          optionLabel: 'schoolName',
          optionValue: 'pid',
        },
      },
      remoteRequest: GetPageList,
      remoteRequestRoute: '/api/Base/School',
      remoteRequestParams: {
        data: {},
      },
    },
    {
      header: '年级名称',
      field: 'gradeName',
      component: 'InputText',
      componentProps: {
        InputText: {
          placeholder: '请选择年级名称',
          name: 'gradeName',
        },
      },
    },
    {
      header: '班级名称',
      field: 'className',
      component: 'InputText',
      componentProps: {
        InputText: {
          placeholder: '请选择班级名称',
          name: 'className',
        },
      },
    },
    {
      header: '年级名称',
      field: 'gradeName',
      component: 'InputText',
      componentProps: {
        InputText: {
          placeholder: '请选择年级名称',
          name: 'grade',
        },
      },
    },
    {
      header: '班级名称',
      field: 'className',
      component: 'InputText',
      componentProps: {
        InputText: {
          placeholder: '请选择班级名称',
          name: 'class',
        },
      },
    },
  ],
  initialValues: {
    schoolName: '',
    gradeName: '',
    className: '',
  },
  resolver: valibotResolver(
    v.object({
      schoolName: v.pipe(v.string(), v.nonEmpty('学校名称为必填项')),
    }),
  ),
  expandNum: 3,

  confirmRequest: getAuditInfo,
  confirmRequestRoute: '/api/Base/BindStudent',
}
