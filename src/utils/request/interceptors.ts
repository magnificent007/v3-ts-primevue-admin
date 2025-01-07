import qs from 'qs'
import { instance } from './instances'
import { addPending, removePending } from './pending'
import whiteList from './whiteList'

instance.interceptors.request.use(
  (config) => {
    if (config.data && config.headers['Content-Type'] === 'application/x-www-form-urlencoded;') {
      config.data = qs.stringify(config.data)
    }

    removePending(config)
    if (!whiteList.some((url: string) => config.url?.match(url))) addPending(config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  async (response) => {
    removePending(response.config)

    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance
