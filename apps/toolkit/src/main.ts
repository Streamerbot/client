import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './plugins/vue-router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

loadFonts();

createApp(App)
  .use(router)
  .use(createPinia())
  .use(vuetify)
  .component('Icon', Icon)
  .mount('#app');
