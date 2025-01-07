import { ref } from 'vue'
import { defineStore } from 'pinia'
import { isArray, isString } from 'lodash-es'

export const useKeepAliveStore = defineStore('keep-alive', () => {
  const includeList = ref<string[]>([])

  const addAliveList = (routeName: string | string[] | undefined) => {
    if (routeName && isArray(routeName)) {
      routeName.forEach((rn: string) => {
        if (!includeList.value.includes(rn)) includeList.value.push(rn)
      })
    } else if (routeName && isString(routeName) && !includeList.value.includes(routeName)) {
      includeList.value.push(routeName)
    }
  }

  const delAliveList = (routeName: string | string[] | undefined) => {
    if (routeName && isArray(routeName)) {
      includeList.value = includeList.value.filter((rn: string) => {
        return !routeName.includes(rn)
      })
    } else if (routeName && isString(routeName)) {
      includeList.value = includeList.value.filter((rn: string) => rn !== routeName)
    }
  }

  const clear = () => {
    includeList.value = []
  }

  return {
    includeList,

    addAliveList,
    delAliveList,
    clear,
  }
})

export default useKeepAliveStore
