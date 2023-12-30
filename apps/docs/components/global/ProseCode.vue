<script setup lang="ts">
const props = defineProps<{
  code: string
  icon?: string
  language?: string
  hideHeader?: boolean
  filename?: string
  highlights?: number[]
  meta?: string
}>()

const config = {
  wrapper: '[&>pre]:!rounded-t-none [&>pre]:!my-0 my-5',
  importWrapper: '[&>pre]:!whitespace-nowrap',
  header: 'flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 border-b-0 relative rounded-t-md px-4 py-3 not-prose',
  icon: {
    base: ''
  },
  button: {
    base: 'absolute top-2.5 right-2.5'
  },
  filename: 'text-gray-700 dark:text-gray-200 text-sm/6'
}

const { ui } = useUI('content.prose.code', undefined, config, undefined, true)

// Handle Streamer.bot import codes
const isImportCode = props?.filename?.match(/(streamerbot|sb)-import/);
const name = computed(() => isImportCode ? 'Import Code' : props.filename);
</script>

<template>
  <div class="relative" :class="{
    [ui.wrapper]: !!name,
    [ui.importWrapper]: isImportCode
  }">
    <div v-if="name && !hideHeader" :class="ui.header">
      <IconStreamerbot v-if="isImportCode" :class="ui.icon.base" height="16" width="16" />
      <ProseCodeIcon v-else :icon="icon" :filename="name" :class="ui.icon.base" />
      <span :class="ui.filename">{{ name }}</span>
    </div>
    <ProseCodeButton :code="code" :class="ui.button.base" />
    <slot />
  </div>
</template>

<style>
pre code .line {
  display: block;
  min-height: 1rem;
}
</style>