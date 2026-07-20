<script setup lang="ts">
const { color = 'success' } = defineProps<{
  color?: 'neutral' | 'secondary' | 'info' | 'success' | 'warning' | 'error'
}>();
</script>

<template>
  <ProseCallout
    icon="i-mdi-check"
    :color
  >
    <slot mdc-unwrap="p" />
  </ProseCallout>
</template>