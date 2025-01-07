<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const menus = [
  {
    label: '首页',
    icon: 'pi pi-home',
    items: [
      {
        label: '首页',
        icon: 'pi pi-home',
        command: () => router.push({ name: 'Home' }),
      },
    ],
  },
  {
    label: '关于',
    icon: 'pi pi-user',
    items: [
      {
        label: '关于',
        icon: 'pi pi-user',
        command: () => router.push({ name: 'About' }),
      },
    ],
  },
  {
    label: '课程管理',
    icon: 'pi pi-user',
    items: [
      {
        label: '章管理',
        icon: 'pi pi-user',
        command: () => router.push({ name: 'Chapter' }),
      },
    ],
  },
]
</script>

<template>
  <PanelMenu class="bg-transparent" :model="menus" />
</template>

<style scoped lang=""></style>
