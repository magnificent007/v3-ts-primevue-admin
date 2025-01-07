import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './stores'
import { setupRouter } from './router'
import { setupGlobalComp, setupAssets } from './plugins'

export const app = createApp(App)
export default app

function setupPlugins() {
  setupAssets()
  setupGlobalComp(app)
}

function setupApp() {
  setupRouter(app)
  setupStore(app)

  app.mount('#app')
}

setupPlugins()
setupApp()
