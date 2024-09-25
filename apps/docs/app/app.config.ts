export default defineAppConfig({
  // FIXME: This is a workaround for nuxt-icon typecheck errors: https://github.com/nuxt-modules/icon/issues/86
  nuxtIcon: {
    aliases: undefined,
    class: undefined,
    size: undefined,
  },

  ui: {
    primary: 'blue',
    gray: 'neutral',
  },
});
