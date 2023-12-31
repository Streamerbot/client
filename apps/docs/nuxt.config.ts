
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'nuxt-link-checker',
    'nuxt-icon',
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
    embedded: true,
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

  hooks: {
    // Related to https://github.com/nuxt/nuxt/pull/22558
    // Adding all global components to the main entry
    // To avoid lagging during page navigation on client-side
    // Downside: bigger JS bundle
    // With sync: 465KB, gzip: 204KB
    // Without: 418KB, gzip: 184KB
    'components:extend'(components) {
      for (const comp of components) {
        if (comp.global) {
          comp.global = 'sync';
        }
      }
    },
  },

  ogImage: {
    runtimeCacheStorage: true,
    defaults: {
      cacheTtl: 60 * 60 * 24 * 30, // 30 daysc
    },
  },

  linkChecker: {
    enabled: true,
    showLiveInspections: true,
    fetchRemoteUrls: false,
    report: {
      html: true,
      markdown: true,
    },
  },
});