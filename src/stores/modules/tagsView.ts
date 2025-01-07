import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import toast from '@/composables/toastService'
import { useKeepAliveStore } from './keepAlive'
import type {
  RouteLocationNormalizedLoaded,
  RouteRecordNormalized,
  RouteRecordName,
} from 'vue-router'

export const useTagsViewStore = defineStore('tags-view', () => {
  const tabsList = ref<Array<any>>([])

  const currentRoute = useRoute()
  const router = useRouter()

  const addTab = (route: RouteLocationNormalizedLoaded) => {
    const keepAliveStore = useKeepAliveStore()
    const isExists = tabsList.value.some(
      (item: RouteLocationNormalizedLoaded) => item.fullPath === route.fullPath,
    )
    if (!isExists) {
      if (tabsList.value.length >= 15) {
        toast.add({
          severity: 'warn',
          summary: '警告',
          detail: '请关闭多余系统标签页以免影响系统性能',
          life: 3000,
        })
      }
      tabsList.value.push({ ...route })
      // 保持路由激活状态
      const addRouteCompName = getRouteComponentName(route.name)
      keepAliveStore.addAliveList(addRouteCompName)
    }
  }

  const removeTab = (fullPath: string) => {
    const keepAliveStore = useKeepAliveStore()
    if (tabsList.value.length === 1) {
      toast.add({ severity: 'warn', summary: '警告', detail: '标签页禁止全部关闭', life: 3000 })
      return
    }

    const index = tabsList.value.findIndex(
      (item: RouteLocationNormalizedLoaded) => item.fullPath === fullPath,
    )
    const isDelCurrentTab = Object.is(getCurrentTab.value, tabsList.value[index])
    const route = tabsList.value.splice(index, 1)
    // 移除路由激活状态
    const delRouteCompName = getRouteComponentName(route[0].name)
    keepAliveStore.delAliveList(delRouteCompName)

    /**
     * 两种情况：1. 关闭当前激活的标签页 2. 关闭其他标签页
     */
    if (isDelCurrentTab) {
      router.push(tabsList.value[Math.max(0, tabsList.value.length - 1)])
    }
  }

  const getCurrentTab = computed(() => {
    return tabsList.value.find(
      (item: RouteLocationNormalizedLoaded) => item.fullPath === currentRoute.fullPath,
    )
  })

  const changeTabs = (targetKey: string) => {
    router.push(targetKey)
  }

  /**
   * 获取路由组件的名称
   * @param routeName 路由名称
   * @returns
   */
  const getRouteComponentName = (
    routeName: RouteRecordName | null | undefined,
  ): string | undefined => {
    if (!routeName) return undefined
    const routes = router.getRoutes()
    const currRouteName = routes.find((r: RouteRecordNormalized) => r.name === routeName)
      ?.components?.default?.name
    return currRouteName
  }

  watch(
    () => currentRoute.fullPath,
    () => {
      if (currentRoute.name !== 'Login') {
        addTab(currentRoute)
      }
    },
    {
      immediate: true,
    },
  )

  return {
    tabsList,
    getCurrentTab,
    changeTabs,
    removeTab,
  }
})
