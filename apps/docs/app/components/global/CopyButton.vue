<script setup lang="ts">
const props = defineProps<{
  content: string
}>();

const { copy, isSupported } = useClipboard({ source: props.content });
</script>

<template>
  <UButton icon="i-mdi-content-copy" color="gray" variant="link" size="xs" :disabled="!isSupported" @click="() => copy()" />
</template>