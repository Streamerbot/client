<script setup lang="ts">
defineProps<{
  src: string;
}>();
</script>

<template>
  <img :src="src" class="grayscale min-w-3 min-h-3" v-bind="$attrs" />
</template>
