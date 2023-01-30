<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { z } from 'zod';
import { useStreamerbotStore } from '../stores/streamerbot.store';

const store = useStreamerbotStore();

const schema = z.object({
  host: z.string({ invalid_type_error: 'Host must be a string' }).min(1),
  port: z.number({ invalid_type_error: 'Port must be a number' }).max(65535),
  endpoint: z.string().startsWith('/', { message: 'Endpoint must start with "/"' }),
}).required();

const zodResult = ref<any>();
const zodErrors = computed(() => {
  return zodResult.value?.error?.format();
});

watch([() => store.host, () => store.port, () => store.endpoint], () => validate(), { immediate: true });

function validate() {
  zodResult.value = schema.safeParse({
    host: store.host,
    port: store.port,
    endpoint: store.endpoint,
  });

  return zodResult.value;
}
</script>

<template>
  <v-slide-y-transition leave-absolute>
    <v-alert
      v-if="store.error"
      title="WebSocket Error"
      :text="store.error"
      :icon="false"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-3"
    ></v-alert>
  </v-slide-y-transition>

  <v-slide-y-transition leave-absolute>
    <v-alert
      v-if="store.host !== '127.0.0.1'"
      :text="`Hosts other than localhost (127.0.0.1) are not officially supported and should be used by advanced users only.`"
      :icon="false"
      type="warning"
      variant="tonal"
      density="compact"
      class="mb-3"
    ></v-alert>
  </v-slide-y-transition>

  <v-text-field
    v-model="store.host"
    :error-messages="zodErrors?.host?._errors"
    label="Host"
    variant="filled"
    hint="Enter your Streamer.bot WebSocket server host. Default is 127.0.0.1"
    persistent-hint
    class="mb-3"
  />
  <v-text-field
    v-model.number="store.port"
    :error-messages="zodErrors?.port?._errors"
    label="Port"
    variant="filled"
    type="number"
    hint="Enter your Streamer.bot WebSocket server port. Default is 8080"
    persistent-hint
    class="mb-3"
  />
  <v-text-field
    v-model="store.endpoint"
    :error-messages="zodErrors?.endpoint?._errors"
    label="Endpoint"
    variant="filled"
    hint="Enter your Streamer.bot WebSocket server endpoint. Default is /"
    persistent-hint
    class="mb-3"
  />

  <v-btn
    block
    color="primary"
    variant="tonal"
    size="large"
    class="mt-5"
    :disabled="!!zodResult?.error"
    :loading="store.isConnecting"
    @click.prevent="store.connect"
  >Connect</v-btn>
</template>

