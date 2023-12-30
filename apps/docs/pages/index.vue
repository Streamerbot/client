<script setup lang="ts">
import { useSeo } from '~/composables/useSeo';

const route = useRoute()
const { data: page } = await useAsyncData('index', () => queryContent(route.path).findOne())
if (!page.value) throw createError({ statusCode: 404 });

useSeo(page);
</script>

<template>
  <div>
    <ULandingHero orientation="horizontal">
      <template #title>
        {{ page.title }}
      </template>

      <template #description>
        <span>{{ page.description }}</span>
      </template>

      <template #links>
        <UButton v-for="link in page.hero.links" :key="link.to" v-bind="link" />
      </template>

      <template #default>
        <div class="gradient" />
        <MDC :value="page.hero.code" tag="pre" class="prose prose-primary dark:prose-invert mx-auto" />
      </template>
    </ULandingHero>

    <ULandingSection
      title="Real-time interaction with ease"
      description="Build your own browser sources, overlays, or even full-blown NodeJS applications taking advantage of real-time data from Streamer.bot "
      :features="page.features || []"
    />
  </div>
</template>

<style scoped>
.gradient {
  position: absolute;
  left: 0;
  right: 0;
  top: 25vh;
  width: 100%;
  height: 30vh;
  background: radial-gradient(50% 50% at 50% 50%, rgb(1, 126, 199) 0%, rgba(0, 220, 130, 0) 100%);
  filter: blur(150px);
  border-radius: 50%;
  opacity: 0.5;
  z-index: -1;
}
</style>