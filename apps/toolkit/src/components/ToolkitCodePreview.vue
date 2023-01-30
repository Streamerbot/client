<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import Prism from "prismjs";
import 'prismjs/themes/prism-tomorrow.css';
import { nextTick, watch } from 'vue';

type Props = {
  modelValue?: string | object | undefined;
};
const props = defineProps<Props>();

watch(() => props.modelValue, refreshPrism, { immediate: true });

function refreshPrism() {
  nextTick(() => Prism.highlightAll());
}

const { copy, isSupported } = useClipboard();
function copyText() {
  const text = typeof props.modelValue === 'string' ? props.modelValue : JSON.stringify(props.modelValue);
  copy(text);
}
</script>

<template>
  <div class="position-relative">
    <pre class="language-javascript"><code>{{ modelValue }}</code></pre>
    <span class="position-absolute" style="top: 1rem; right: 1.5rem">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <span v-bind="props">
            <v-btn
              size="x-small"
              icon
              @click="copyText"
              :disabled="!isSupported"
            >
              <v-icon size="small">mdi-content-copy</v-icon>
            </v-btn>
          </span>
        </template>
        <small class="text-white">{{
          isSupported ? 'Copy' : 'Clipboard Permission Required'
        }}</small>
      </v-tooltip>
    </span>
  </div>
</template>

<style scoped>
pre.language-javascript {
  background: none;
  text-shadow: none;
}

code {
  white-space: pre-wrap !important;
}
</style>