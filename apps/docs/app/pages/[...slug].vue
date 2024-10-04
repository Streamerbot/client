<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types';
import { withoutTrailingSlash } from 'ufo';
import { useLinks } from '~/composables/useLinks';
import { useSeo } from '~/composables/useSeo';

const route = useRoute()

definePageMeta({
  layout: 'docs'
})

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryContent()
    .where({
      _extension: 'md',
      _partial: false,
      navigation: {
        $ne: false
      }
    })
    .only(['title', 'description', '_path'])
    .findSurround(withoutTrailingSlash(route.path))
})

useSeo(page);
const headline = computed(() => findPageHeadline(page.value))
const { communityLinks, ecosystemLinks } = useLinks(page);
</script>

<template>
  <UPage>
    <UPageHeader :title="page.title" :description="page.description" :links="page.links" :headline="headline" class="relative">
      <template v-if="!page.links && page.logo" #default>
        <div class="absolute top-16 right-0">
          <ProseImg :src="page.logo" class="h-12 max-w-14" />
        </div>
      </template>
    </UPageHeader>

    <UPageBody prose>
      <ContentRenderer v-if="page.body" :value="page" />

      <hr v-if="surround?.length">

      <UContentSurround :surround="(surround as ParsedContent[])" />
    </UPageBody>

    <template #right>
      <UContentToc :links="page.body?.toc.links">
        <template #bottom>
          <div class="hidden lg:block space-y-6 !mt-6">
            <UDivider v-if="page.body?.toc?.links?.length" type="dashed" />
            <UPageLinks title="Community" :links="communityLinks" />
            <UDivider type="dashed" />
            <UPageLinks title="Ecosystem" :links="ecosystemLinks" />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>