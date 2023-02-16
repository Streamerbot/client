<script lang="ts" setup>
</script>

<template>
  <div class="logo">
    <img src="https://streamer.bot/logo-transparent.svg" width="26" />
    <span>Streamer.bot <span>Client</span></span>
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
}

.logo > span {
  font-weight: var(--fontWeight-light);
  font-size: var(--fontSize-xl);
  color: var(--color-gray-300);
}

.logo > span > span {
  font-weight: var(--fontWeight-normal);
  color: var(--color-gray-100);
}
</style>