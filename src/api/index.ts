import { request, type ApiOptions } from '@/utils/request/request'
export const baseUrl = '/api'

export function GetPageList(methodRoute: string, options: ApiOptions) {
  return request({
    baseUrl,
    methodRoute,
    url: '/GetPageList',
    method: 'POST',
    options,
  })
}

/**
 * 查看审核详情
 * @param options
 * @returns
 */
export function getAuditInfo(methodRoute: string, options: ApiOptions) {
  return request({
    baseUrl,
    methodRoute,
    url: '/GetAuditInfo',
    method: 'POST',
    options,
  })
}

export function deleteChapter(methodRoute: string, options: ApiOptions) {
  return request({
    baseUrl,
    methodRoute,
    url: `/DeleteChapter/${options.data.pid}`,
    method: 'GET',
    options,
  })
}

export function operateChapter(methodRoute: string, options: ApiOptions) {
  return request({
    baseUrl,
    methodRoute,
    url: '/OperateChapter',
    method: 'POST',
    options,
  })
}
