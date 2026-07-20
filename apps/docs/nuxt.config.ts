export default defineNuxtConfig({
  extends: ['docus'],

  modules: ['@vueuse/nuxt', 'nuxt-og-image', 'nuxt-link-checker'],

  app: {
    baseURL: '/client/',
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/client/favicon.ico' }],
    },
  },

  site: {
    url: 'https://streamerbot.github.io/',
    name: 'Streamer.bot WebSocket Client',
    twitterCard: 'summary_large_image',
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    routeRules: {
      '/get-started': { redirect: { to: '/get-started/installation', statusCode: 301 } },
      '/guide': { redirect: { to: '/guide/actions', statusCode: 301 } },
      '/api': { redirect: { to: '/api/config', statusCode: 301 } },
      '/api/methods': { redirect: { to: '/api/requests', statusCode: 301 } },
    },
    prerender: {
      crawlLinks: true,
    },
  },

  ogImage: {
    zeroRuntime: true, // Set to true when prerendering all pages for static hosting
    runtimeCacheStorage: {
      driver: 'fs',
      base: '.data/og-image-cache',
    },
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
    },
  },

  fonts: {
    families: [
      { name: 'DM Sans', global: true },
      // Explicitly define weights and set as global for OgImage rendering
      { name: 'Jost', weights: [200, 300, 400, 500, 600, 700], global: true },
      { name: 'DM Mono', weights: [300, 400, 500], global: true },
    ],
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2026-07-09',

  vite: {
    optimizeDeps: {
      include: [],
    },
  },

  $development: {
    debug: false,
    sourcemap: true,
    devtools: {
      enabled: true,
    },
  },
});
