import { createRouter, createWebHistory } from 'vue-router'
import routes from './modules'
import type { App } from 'vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export const setupRouter = async (app: App<Element>) => {
  app.use(router)
  await router.isReady()
}

export default router
