import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import Tooltip from 'primevue/tooltip'
import { Noir, zh_cn } from '@/presets'

export const setupGlobalComp = (app: App<Element>) => {
  app.use(PrimeVue, {
    locale: zh_cn,
    theme: {
      preset: Noir,
      options: {
        prefix: 'v3-app',
        darkModeSelector: '.v3-app-dark',
        cssLayer: false,
        inputVariant: 'filled',
      },
    },
  })
  app.use(ToastService)
  app.use(DialogService)
  app.directive('tooltip', Tooltip)
}

export default setupGlobalComp
