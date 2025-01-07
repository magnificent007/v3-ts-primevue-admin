<script lang="ts" setup>
import { usePvForm } from '@/components/basic/pvForm'
import { formConfig } from './config'

import { Select, Button } from 'primevue'
import { ref } from 'vue'

defineOptions({
  name: 'About',
})

const { FormView } = usePvForm(formConfig)

const options = [
  {
    value: '1',
    label: '一',
  },
  {
    value: '2',
    label: '二',
  },
]

const v = ref('')
function setVal() {
  v.value = '1'
  options.push({
    value: '3',
    label: '三',
  })
}

const selectedCity = ref()
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
])
</script>

<template>
  <div class="w-full h-full py-3 overflow-hidden">
    <FormView />
    <Select
      option-label="label"
      option-value="value"
      :options="options"
      :modelValue="v"
      @change="(e) => console.log('change-', e)"
      @value-change="(e) => console.log('value chagne-', e)"
    ></Select>

    <Select
      v-model="selectedCity"
      :options="cities"
      optionLabel="name"
      placeholder="Select a City"
      @change="() => console.log('change')"
      @value-change="() => console.log('value chagne')"
    />

    <Button label="点击就送" @click="setVal"></Button>
  </div>
</template>

<style lang="scss" scoped></style>
