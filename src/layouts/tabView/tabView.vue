<script lang="ts" setup>
import { ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTagsViewStore, useKeepAliveStore } from '@/stores/modules'

const currentRoute = useRoute()
const tagsViewStore = useTagsViewStore()
const keepAliveStore = useKeepAliveStore()
const { tabsList } = storeToRefs(tagsViewStore)
const { includeList } = storeToRefs(keepAliveStore)

const tabsRef = ref<HTMLUListElement | null>(null)
const home = ref({
  icon: 'pi pi-home',
})
const items = ref([
  { label: 'Electronics' },
  { label: 'Computer' },
  { label: 'Accessories' },
  { label: 'Keyboard' },
  { label: 'Wireless' },
])
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- <Breadcrumb :home="home" :model="items" /> -->
    <div
      class="overflow-hidden flex flex-nowrap items-center gap-2 border-b-[#dddddd] border-b-1 border-b-solid"
    >
      <i
        class="pi pi-angle-left cursor-pointer"
        @click="tabsRef?.scrollBy({ left: -200, behavior: 'smooth' })"
      />
      <ul
        class="flex-1 my-0 p-0 block flex flex-nowrap gap-2 list-none overflow-x-auto scrollbar-none"
        ref="tabsRef"
      >
        <li
          :class="[
            'box-border p-2 inline-block flex flex-nowrap gap-2 justify-center items-center text-nowrap cursor-pointer',
            currentRoute.fullPath === tabItem.fullPath
              ? 'bg-[#ffffff] dark:bg-slate-600 border-b-[#dddddd] border-b-solid'
              : 'bg-[#fafafa] dark:bg-transparent',
          ]"
          v-for="tabItem in tabsList"
          :key="tabItem.fullPath"
          :value="tabItem.fullPath"
        >
          <span @click="tagsViewStore.changeTabs(tabItem.fullPath)">{{
            tabItem?.meta?.title || ''
          }}</span>
          <i
            class="pi pi-times"
            @click="
              (e: Event) => {
                e.preventDefault()
                tagsViewStore.removeTab(tabItem.fullPath)
              }
            "
          />
        </li>
      </ul>
      <i
        class="pi pi-angle-right cursor-pointer"
        @click="tabsRef?.scrollBy({ left: 200, behavior: 'smooth' })"
      />
    </div>
    <div class="flex-1 overflow-hidden">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Suspense>
            <Transition name="slide-fade">
              <KeepAlive :include="includeList">
                <component :is="Component"></component>
              </KeepAlive>
            </Transition>
            <template #fallback>
              <div class="w-full h-full flex items-center justify-center">Loading...</div>
            </template>
          </Suspense>
        </template>
      </RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
