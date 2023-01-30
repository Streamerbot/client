import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import pages from 'vite-plugin-pages';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  plugins: [vue(), pages(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': resolve(__dirname, 'node_modules/'),
    },
  },
});
