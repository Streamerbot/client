<script setup lang="ts">
import colors from '#tailwind-config/theme/colors';

const appConfig = useAppConfig()

const config = {
  wrapper: 'block pl-4 pr-6 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm/6 my-5 last:mb-0 font-normal group relative prose-code:bg-white dark:prose-code:bg-gray-900',
  to: 'hover:border-[--color-light] dark:hover:border-[--color-dark] hover:text-[--color-light] dark:hover:text-[--color-dark] border-dashed hover:border-solid hover:text-gray-800 dark:hover:text-gray-200',
  icon: {
    base: 'w-4 h-4 mr-2 inline-flex items-center align-sub text-[--color-light] dark:text-[--color-dark]'
  },
  externalIcon: {
    name: appConfig.ui.icons.external,
    base: 'w-4 h-4 absolute right-2 top-2 text-gray-400 dark:text-gray-500 group-hover:text-[--color-light] dark:group-hover:text-[--color-dark]'
  }
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  icon?: string
  color?: string
  to?: string
  target?: string
  ui?: Partial<typeof config>
  class?: any,
  title?: string,
  description?: string
}>(), {
  icon: 'i-mdi-wrench',
  color: 'amber',
  to: undefined,
  target: undefined,
  ui: () => ({}),
  class: undefined,
  title: `Documentation in Progress`,
  description: `Wiki migration currently in progress`
})

const { ui, attrs } = useUI('content.callout', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const colorLight = computed(() => {
  if (props.color === 'primary') {
    return 'rgb(var(--color-primary-DEFAULT))'
  }
  return colors[props.color]?.['500'] || props.color
})
const colorDark = computed(() => {
  if (props.color === 'primary') {
    return 'rgb(var(--color-primary-DEFAULT))'
  }
  return colors[props.color]?.['400'] || props.color
})
</script>

<template>
  <div :class="[ui.wrapper, to && ui.to]" v-bind="attrs" :style="{ '--color-light': colorLight, '--color-dark': colorDark }">
    <NuxtLink v-if="to" :to="to" :target="target" class="focus:outline-none" tabindex="-1">
      <span class="absolute inset-0" aria-hidden="true" />
    </NuxtLink>

    <UIcon v-if="icon" :name="icon" :class="ui.icon.base" />

    <UIcon v-if="!!to && target === '_blank'" :name="ui.externalIcon.name" :class="ui.externalIcon.base" />

    <strong class="mr-2 text-[--color-light] dark:text-[--color-dark]">
      {{ title }}
    </strong><br/>
    <div class="pl-6">
      <ContentSlot :use="$slots.default" unwrap="p">{{ description }}</ContentSlot>
    </div>
  </div>
</template>