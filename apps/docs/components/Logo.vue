<script lang="ts" setup>
</script>

<template>
  <NuxtLink to="/">
    <img src="https://streamer.bot/logo-transparent.svg" width="26" />
    <span>Streamer.bot <span>Client</span></span>
  </NuxtLink>
</template>

<style lang="ts" scoped>
css({
  a: {
    display: 'flex',
    alignItems: 'center',
    flex: 'none',
    span: {
      fontSize: '{fontSize.xl}',
      fontWeight: '{fontWeight.light}',
      color: '{color.gray.300}',
      '@light': { color: '{color.gray.900}' },
      span: {
        fontWeight: '{fontWeight.normal}',
        color: `{color.gray.100}`
      }
    }
  },
  img: {
    color: '{color.black}',
    height: '{space.6}',
    '@dark': {
      color: '{color.white}'
    },
    '@sm': {
      height: '{space.8}'
    }
  }
})
</style>