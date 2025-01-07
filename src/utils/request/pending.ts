import type { InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

const CancelToken = axios.CancelToken
const pending = new Map()

function pendingKey(config: InternalAxiosRequestConfig) {
  return config.url + '&' + config.method
}

export function addPending(config: InternalAxiosRequestConfig) {
  const key = pendingKey(config)
  config.cancelToken = new CancelToken((cancel) => {
    if (!pending.has(key)) pending.set(key, cancel)
  })
}

export function removePending(config: InternalAxiosRequestConfig) {
  const key = pendingKey(config)
  if (pending.has(key)) {
    const cancel = pending.get(key)
    cancel()
    pending.delete(key)
  }
}

export function clearPending() {
  for (const [key, cancel] of pending) {
    cancel && cancel()
  }
  pending.clear()
}
