export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  app: {
    baseURL: '/client/',
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/client/favicon.ico' }],
    },
  },
  colorMode: {
    preference: 'dark',
  }
});
