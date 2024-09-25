<script setup lang="ts">
const links = computed(() => {
  return [{
    label: 'Get Started',
    icon: 'i-mdi-open-page-variant-outline',
    to: '/get-started/installation'
  }, {
    label: 'Guide',
    icon: 'i-mdi-open-page-variant-outline',
    to: '/guide/actions'
  }, {
    label: 'API',
    icon: 'i-mdi-application-cog-outline',
    to: '/api/config'
  }, {
    label: 'Playground',
    icon: 'i-mdi-codepen',
    to: '/playground'
  }]
})

const navigation = inject<ComputedRef<any[]>>('navigation')
</script>

<template>
  <UHeader
    :links="links"
    :class="{
      'border-primary-200/75 dark:border-primary-900/50': $route.path === '/',
      'border-gray-200 dark:border-gray-800': $route.path !== '/'
    }"
  >
    <template #left>
      <HeaderLogoMenu />
    </template>

    <template #right>
      <UDocsSearchButton size="sm" class="max-w-xs" />
      <UColorModeButton />
    </template>

    <template #panel>
      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>