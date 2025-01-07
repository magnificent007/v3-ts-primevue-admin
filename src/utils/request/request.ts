import instance from './interceptors'
import { useToast } from 'primevue/usetoast'

export type Method = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
export type ApiOptions = {
  data: { pageSize?: number | null; pageNum?: number | null } & Record<string, any>
  headers?: Record<string, any>
  timeout?: number
  formUrlEncoded?: boolean
}
export type Options = {
  baseUrl: string
  methodRoute: string
  url: string
  method: Method
  options: ApiOptions
}

export function request({ baseUrl, methodRoute, url, method, options }: Options) {
  // const toast = useToast()

  // eslint-disable-next-line prefer-const
  let { data, headers = {}, timeout = 10000, formUrlEncoded = false } = options
  let contentType = ''

  const fullUrl = baseUrl + methodRoute + url

  if (method === 'GET' && Object.keys(data).length === 1) {
    // const keys = Object.keys(data)
    // fullUrl +=
    // '?' +
    // keys.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&')
    // fullUrl += `?${keys[0]}=${data[keys[0]]}`
    data = {}
  }
  if (formUrlEncoded) {
    contentType = 'application/x-www-form-urlencoded'
  } else {
    contentType = 'application/json'
  }

  return instance({
    url: fullUrl,
    method,
    headers: Object.assign(
      {
        'Content-Type': contentType,
        Authorization:
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleV8xODQ0NTUzMzMwNTI3MzcxMjY0IjoiMGU5Nzk1NTktNzA4ZS00NGJkLWE2MjgtNDI4ZjViM2ExMzVhIiwidXNlcmlkIjoiMTg0NDU1MzMzMDUyNzM3MTI2NCJ9.3U5OQxeWk3cgechRIYldIcdPBMKAWXw8KgKqGQlocrGdSTSK2FHIRwFlN3ftCpApcP4YIJDaLz3ULvCnnC6IMw',
      },
      headers,
    ),
    data,
    timeout,
  })
    .then((res: any) => {
      if (res.data.state === true) {
        return res
      } else {
        // toast.add({ severity: 'warn', summary: '警告', detail: res.data.msg, life: 3000 })
        return undefined
      }
    })
    .catch((err) => {
      if (err.code === 'ECONNABORTED') {
        // toast.add({ severity: 'error', summary: '错误', detail: '网络请求超时！', life: 3000 })
      } else if (err.code === 'ERR_NETWORK') {
        // toast.add({ severity: 'error', summary: '错误', detail: '网络已失联了!', life: 3000 })
      } else if (err.code === 'ERR_CANCELED') {
        /**/
      } else {
        // toast.add({ severity: 'error', summary: '错误', detail: `请求出错：${err.message}`, life: 3000 })
      }
      return undefined
    })
}

export default request
