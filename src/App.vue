<script setup lang="ts">
import { RouterView } from 'vue-router'
import DynamicDialog from 'primevue/dynamicdialog'
</script>

<template>
  <RouterView />
  <Toast />
  <DynamicDialog />
</template>

<style>
* {
  scrollbar-width: thin;
}
</style>
