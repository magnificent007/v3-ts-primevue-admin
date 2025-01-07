<script lang="ts" setup>
import { useTable } from '@/components/basic/pvTable'
import { tableConfig } from './config'

defineOptions({
  name: 'Chapter',
})

const { TableView } = useTable(tableConfig)
</script>

<template>
  <div class="h-full overflow-hidden py-3">
    <TableView />
  </div>
</template>

<style lang="scss" scoped></style>
