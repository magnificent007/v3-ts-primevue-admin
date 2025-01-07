<script lang="ts" setup>
import { ref } from 'vue'
import { Logo, UserMenu } from './components'
import { useCollapseStore } from '@/stores/modules'

const collapseStore = useCollapseStore()
const iconClass = ref<string>('pi-sun')

function onThemeToggler() {
  const root = document.getElementsByTagName('html')[0]

  root.classList.toggle('v3-app-dark')
  iconClass.value = iconClass.value === 'pi-moon' ? 'pi-sun' : 'pi-moon'
}
</script>

<template>
  <Menubar class="h-16 pr-4 lg:pr-20 bg-zinc-50 dark:bg-slate-900">
    <template #start>
      <Logo />
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <Button
          class="w-7 h-7"
          variant="outlined"
          v-tooltip.bottom="`${collapseStore.collapse ? '折叠菜单' : '展开菜单'}`"
          @click="collapseStore.onCollapseToggle"
        >
          <i :class="`pi ${collapseStore.collapse ? 'pi-chevron-left' : 'pi-chevron-right'}`" />
        </Button>
        <Button class="w-7 h-7" variant="outlined" @click="onThemeToggler">
          <i :class="`pi ${iconClass}`" />
        </Button>
        <Button class="w-7 h-7" variant="outlined">
          <i class="pi pi-bars" />
        </Button>

        <UserMenu />
      </div>
    </template>
  </Menubar>
</template>

<style lang="scss" scoped></style>
