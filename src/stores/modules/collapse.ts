import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCollapseStore = defineStore('collapse', () => {
  const collapse = ref(true)

  const onCollapseToggle = () => {
    collapse.value = !collapse.value
  }

  return {
    collapse,
    onCollapseToggle,
  }
})

export default useCollapseStore
