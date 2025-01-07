import Tag from 'primevue/tag'
import PvReview, { ReviewStrategy } from '@/components/business/controls/pvReview'
import type { PvTableProps } from '@/components/basic/pvTable'
import { GetPageList, getAuditInfo } from '@/api'
import Button from 'primevue/button'

const reviewStrategy = new ReviewStrategy()

export const tableConfig: PvTableProps = {
  tableName: '家长审核',
  tableToolbar: {
    end: ({ disabled, context }) => (
      <>
        <Button
          {...{
            label: '批量操作',
            severity: 'secondary',
            onClick: () =>
              alert(
                `批量操作：列禁用disabled：${disabled}，table操作上下文context：${Object.keys(context).join(' ')}`,
              ),
            autofocus: true,
            size: 'small',
            outlined: true,
            disabled: !disabled,
          }}
        />
      </>
    ),
  },
  columns: [
    {
      props: {
        selectionMode: 'multiple',
        style: { minWidth: '2rem' },
      },
    },
    {
      props: {
        header: '创建时间',
        field: 'createTime',
        style: { minWidth: '12.5rem' },
      },
      render: ({ scope }) => {
        return scope.data.createTime ? (
          <Tag {...{ severity: 'primary', value: scope.data.createTime }} />
        ) : (
          <></>
        )
      },
    },
    {
      props: {
        header: '学校名称',
        field: 'schoolName',
        style: { minWidth: '20rem' },
      },
    },
    {
      props: {
        header: '班级名称',
        field: 'className',
        style: { minWidth: '7rem' },
      },
    },
    {
      props: {
        header: '学生姓名',
        field: 'studentName',
        style: { minWidth: '8rem' },
      },
    },
    {
      props: {
        header: '家长姓名',
        field: 'parentsName',
        style: { minWidth: '8rem' },
      },
    },
    {
      props: {
        header: '家长手机号',
        field: 'parentMobile',
        style: { minWidth: '12.5rem' },
      },
    },
    {
      props: {
        header: '用户与学生关系',
        field: 'relationTypeName',
        style: { minWidth: '10rem' },
      },
      render: ({ scope }) => {
        return scope.data.relationTypeName ? (
          <Tag {...{ severity: 'info', value: scope.data.relationTypeName }} />
        ) : (
          <></>
        )
      },
    },
    {
      props: {
        header: '审核状态',
        field: 'reviewStatus',
        style: { minWidth: '10rem' },
      },
      render: ({ scope }) => {
        return scope.data.reviewStatus ? (
          <Tag
            {...{
              severity: scope.data.reviewStatus === 1 ? 'success' : 'danger',
              value: scope.data.reviewStatus === 1 ? '已通过' : '已拒绝',
            }}
          />
        ) : (
          <></>
        )
      },
    },
    {
      props: {
        header: '操作',
        frozen: true,
        style: { minWidth: '12.5rem' },
      },
      render: ({ scope, context, disabled }) => {
        const reviewStatus = scope.data.reviewStatus
        if (reviewStatus === 0) {
          reviewStrategy.setStrategy(reviewStrategy.strategies.s1)
        } else if (reviewStatus === 1) {
          reviewStrategy.setStrategy(reviewStrategy.strategies.s2)
        } else if (reviewStatus === 2) {
          reviewStrategy.setStrategy(reviewStrategy.strategies.s3)
        }
        return (
          <PvReview>
            {{
              default: () => reviewStrategy.executeStrategy({ scope, context, disabled }),
            }}
          </PvReview>
        )
      },
    },
  ],
  searchFilters: [
    {
      header: '学校名称',
      field: 'schoolId',
      component: 'Select',
      componentProps: {
        Select: {
          placeholder: '请输入学校名称',
          filter: true,
          filterPlaceholder: '请输入选项学校名称',
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
      eventBus: {
        emit: { event: 'schoolId', value: 'pid' },
      },
    },
    {
      header: '年级名称',
      field: 'gradeId',
      component: 'Select',
      componentProps: {
        Select: {
          placeholder: '请输入年级名称',
          filter: true,
          filterPlaceholder: '请输入选项年级名称',
          name: 'gradeName',
          optionLabel: 'gradeName',
          optionValue: 'pid',
        },
      },
      remoteRequest: GetPageList,
      remoteRequestRoute: '/api/Base/Grade',
      remoteRequestParams: {
        data: {},
      },
      eventBus: {
        on: 'schoolId',
        emit: { event: 'gradeId', value: 'pid' },
      },
    },
    {
      header: '班级名称',
      field: 'classId',
      component: 'Select',
      componentProps: {
        Select: {
          placeholder: '请输入班级名称',
          filter: true,
          filterPlaceholder: '请输入选项班级名称',
          name: 'className',
          optionLabel: 'className',
          optionValue: 'pid',
        },
      },
      remoteRequest: GetPageList,
      remoteRequestRoute: '/api/Base/Class',
      remoteRequestParams: {
        data: {},
      },
      eventBus: {
        on: 'gradeId',
      },
    },
  ],
  remoteRequest: getAuditInfo,
  remoteRequestRoute: '/api/Base/BindStudent',
  remoteRequestParams: {
    data: {
      classId: null,
      gradeId: null,
      mobile: '',
      pageNum: 1,
      pageSize: 20,
      reviewStatus: null,
      schoolId: null,
      studentName: '',
    },
  },
}
