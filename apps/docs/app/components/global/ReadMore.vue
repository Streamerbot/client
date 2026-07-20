<script setup lang="ts">
/**
 * Credit to Nuxt
 * https://github.com/nuxt/nuxt.com/blob/main/components/content/ReadMore.vue
 * https://github.com/nuxt/nuxt.com/blob/main/utils/index.ts
 */
import { splitByCase, upperFirst } from 'scule';

const props = defineProps({
  to: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
    default: '',
  },
});

const replacements = {
  'Api': 'API',
  'Csharp': 'C#',
}

const createBreadcrumb = (link: string = 'here') => {
  if (link.startsWith('http')) {
    return link.replace(/^https?:\/\//, '')
  }
  return link
    .split(/[\/\#]/)
    .filter(Boolean)
    .map((part) =>
      splitByCase(part)
        .map((p) => {
          p = upperFirst(p)
          for (const [key, value] of Object.entries(replacements)) {
            p = p.replace(new RegExp(key), value)
          }
          return p;
        })
        .join(' '),
    )
    .join(' > ')
}

// Guess title from link!
const computedTitle = computed<string>(() => props.title || createBreadcrumb(props.to))
const target = computed(() => props.to?.startsWith('http') ? '_blank' : '')
</script>

<template>
  <ProseCallout
    icon="i-mdi-bookmark"
    :to="to"
    :target
    color="neutral"
    :ui="{
      icon: 'text-primary'
    }"
  >
    <slot mdc-unwrap="p">
      Read more in <span class="font-bold" v-html="computedTitle" />
    </slot>
    <UIcon v-if="target !== '_blank'" name="i-mdi-chevron-right" class="text-neutral-400 size-5 absolute right-2 top-3.5"></UIcon>
  </ProseCallout>
</template>