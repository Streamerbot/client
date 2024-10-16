<script setup lang="ts">
import { useGlobalVariable } from '../composables';

const { name } = defineProps<{ name: string }>();
const { value } = useGlobalVariable(name);
</script>

<template>
  <span v-bind="$attrs">
    <template v-if="value !== undefined">
      {{ value }}
    </template>
    <slot name="empty" v-else />
  </span>
</template>