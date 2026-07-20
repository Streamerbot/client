<script setup lang="ts">
const ui = {
  variants: {
    color: {
      neutral: {
        icon: 'text-primary'
      }
    }
  }
}
</script>

<template>
  <ProseCallout
    icon="i-mdi-navigation"
    color="neutral"
    :ui="{
      icon: 'text-primary'
    }"
  >
    <slot mdc-unwrap="p" />
  </ProseCallout>
</template>