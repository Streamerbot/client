export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'nuxt-link-checker',
    '@nuxt/content',
  ],

  app: {
    baseURL: '/client',
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/client/favicon.ico' }],
    },
  },

  imports: {
    dirs: ['composables'],
  },

  site: {
    url: 'https://streamerbot.github.io/client',
    name: 'Streamer.bot WebSocket Client',
    twitterCard: 'summary_large_image',
  },

  ui: {
    global: true,
    icons: ['mdi', 'heroicons', 'simple-icons', 'vscode-icons', 'logos', 'carbon', 'skill-icons'],
  },

  colorMode: {
    preference: 'dark',
  },

  devtools: {
    enabled: true,
  },

  content: {
    navigation: {
      fields: [
        'icon',
        'titleTemplate',
        'header',
        'main',
        'aside',
        'footer',
        'category',
        'version',
        'badge',
      ],
    },
    highlight: {
      preload: [
        'js',
        'ts',
        'csharp',
        'bash',
        'json',
        'yaml',
        'markdown',
        'html',
        'css',
        'scss',
        'less',
        'xml',
        'diff',
      ],
    },
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [400, 500, 600, 700],
    },
  },

  nitro: {
    routeRules: {
      '/get-started': { redirect: { to: '/get-started/installation', statusCode: 301 } },
      '/guide': { redirect: { to: '/guide/actions', statusCode: 301 } },
      '/api': { redirect: { to: '/api/config', statusCode: 301 } },
    },
    prerender: {
      crawlLinks: true,
      routes: ['/api/search.json'],
    },
  },

  ogImage: {
    runtimeCacheStorage: true,
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
    },
  },

  linkChecker: {
    enabled: false,
    showLiveInspections: true,
    fetchRemoteUrls: false,
    report: {
      html: true,
      markdown: true,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-09-25',
});