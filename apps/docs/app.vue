<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types';
import { debounce } from 'perfect-debounce';
import { gt } from 'semver';
import { withoutTrailingSlash } from 'ufo';

const searchRef = ref()

const route = useRoute()
const colorMode = useColorMode()

const { data: nav } = await useAsyncData('navigation', () => fetchContentNavigation())
const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', { default: () => [], server: false })

// Computed
const navigation = computed(() => {
  return nav.value?.filter(item => !item._path.match(/^\/(changelogs)/i))
})
const changelogNavigation = computed(() => {
  return nav.value?.filter(item => item._path.match(/^\/changelogs/i)).map(item => {
    item.children?.sort((a, b) => {
      return gt(a.version, b.version) ? -1 : 1;
    })
    return item;
  })?.[0].children;
})
const groups = computed(() => {
  return [];
})
const fuse = {
  fuseOptions: {
    threshold: 0.3,
    useExtendedSearch: true,
    keys: [
      { name: 'prefix', weight: 7 }
    ]
  }
}

const color = computed(() => colorMode.value === 'dark' ? '#18181b' : 'white')

// Watch
watch(() => searchRef.value?.commandPaletteRef?.query, debounce((query: string) => {
  if (!query) {
    return
  }
}, 500));

// Head
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    { rel: 'canonical', href: `https://streamerbot.github.io${withoutTrailingSlash(route.path)}` }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// Provide
provide('fullNavigation', nav)
provide('changelogNavigation', changelogNavigation)
provide('navigation', navigation)
provide('files', files)
</script>

<template>
  <div>
    <Header />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Footer />

    <ClientOnly>
      <LazyDocsSearch ref="searchRef" :files="files" :navigation="nav" :groups="groups" :fuse="fuse" />
    </ClientOnly>

    <UNotifications>
      <template #title="{ title }">
        <span v-html="title" />
      </template>

      <template #description="{ description }">
        <span v-html="description" />
      </template>
    </UNotifications>
  </div>
</template>