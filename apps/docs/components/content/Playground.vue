<script setup lang="ts">
import { StreamerbotEventName, StreamerbotEvents } from '@streamerbot/client';
import { useStreamerbot } from '@streamerbot/vue';

const { client, status, connect, disconnect, data } = useStreamerbot({
  immediate: false,
  autoReconnect: false,
  subscribe: '*'
});

onMounted(() => {
  if (process.client) {
    connect();
  }
})

const selectedSource = ref<keyof typeof StreamerbotEvents>('Twitch');
const selectedEvent = ref<string>('ChatMessage');
const event = computed<StreamerbotEventName>(() => `${selectedSource.value}.${selectedEvent.value}` as StreamerbotEventName);

const logs = ref<any>([]);

// reset logs when event changes
watch(event, () => {
  logs.value = [];
}, { immediate: true });

watch(data, (val) => {
  if (val?.event) {
    if (`${val.event?.source}.${val.event?.type}` === event.value) {
      console.log('test');
      logs.value.push(val);
    }
  }

  // limit to 10 max
  if (logs.value?.length > 10) {
    logs.value = logs.value.slice(-10);
  }
})

const codeSnippet = computed<string>(() => {
  return `
    client.on("${selectedSource.value}.${selectedEvent.value}", (data) => {
      console.log(data);
    });
  `
});
</script>

<template>
  <div class="sb-playground">
    <div class="toolbar">
      <h2 style="margin-right: 10px;">
        Status: <span :class="{ connected: status === 'OPEN', disconnected: status !== 'OPEN' }">{{ status === 'OPEN' ? 'Connected' : status === 'CONNECTING' ? 'Connecting...' : 'Disconnected' }}</span>
      </h2>
      <button v-if="status === 'OPEN'" @click="disconnect">Disconnect</button>
      <button v-else @click="connect">Connect</button>
    </div>

    <div style="margin-top">
      <select v-model="selectedSource">
        <option v-for="(events, source) in StreamerbotEvents">{{ source }}</option>
      </select>
      <select v-model="selectedEvent">
        <option v-for="event in StreamerbotEvents[selectedSource]">{{ event }}</option>
      </select>
    </div>

    <ProseCode language="ts" :code="codeSnippet" filename="Snippet">
      <pre><code>{{ codeSnippet }}</code></pre>
    </ProseCode>

    <ProseCode language="json" :code="JSON.stringify(logs)" filename="Events Feed">
      <pre><code>{{ logs }}</code></pre>
    </ProseCode>
  </div>
</template>

<style scoped lang="ts">
css({
  '.sb-playground': {
    '.toolbar': {
      display: 'flex',
      alignItems: 'center'
    },
    '.connected': { color: '{color.green.400}' },
    '.disconnected': { color: '{color.red.400}' },
    button: {
      position: 'relative',
      minWidth: '100px',
      padding: '{space.2}',
      fontWeight: 'bold',
      border: '1px solid {elements.border.primary.default}',
      borderRadius: '{radii.lg}',
      '&:hover': {
        borderColor: '{color.primary.100}',
        color: '{color.primary.500}',
      },
      '@dark': {
        '&:hover': {
          borderColor: '{color.primary.700}',
        }
      },
    }
  }
})
</style>