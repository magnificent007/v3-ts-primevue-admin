import { createPinia } from 'pinia'
import type { App } from 'vue'

export const store = createPinia()

export const setupStore = (app: App<Element>) => {
  app.use(store)
}

export default store
