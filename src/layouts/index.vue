<script lang="ts" setup>
import Header from './header/header.vue'
import SideMenu from './sideMenu/sideMenu.vue'
import TabView from './tabView/tabView.vue'
import Footer from './footer/footer.vue'
import { useCollapseStore } from '@/stores/modules'

const collapseStore = useCollapseStore()
</script>

<template>
  <div class="w-screen h-screen flex flex-col">
    <Header />
    <div class="flex flex-nowrap flex-1 overflow-hidden">
      <Transition name="slide-fade">
        <aside
          class="w-[240px] p-4 box-border overflow-y-auto bg-zinc-50 dark:bg-slate-900"
          v-show="collapseStore.collapse"
        >
          <SideMenu></SideMenu>
        </aside>
      </Transition>
      <main
        class="w-full h-full p-4 box-border overflow-hidden dark:bg-slate-800 flex-1 flex flex-col"
      >
        <article class="flex-1 overflow-inherit">
          <TabView></TabView>
        </article>
        <Footer></Footer>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
