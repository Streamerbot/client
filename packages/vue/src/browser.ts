import type { Plugin, App as VueApp } from 'vue';
import * as components from './components';

const install: Plugin = {
  install(app) {
    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components]);
  },
};

if (typeof window !== 'undefined' && 'Vue' in window && window.Vue) {
  (window.Vue as VueApp).use(install);
}

export * from './composables';
export default { install };
