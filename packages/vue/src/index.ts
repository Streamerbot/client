import type { Plugin } from 'vue'
import * as components from './components'

const install: Plugin = {
  install(app) {
    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}

export * from './composables'
export default install