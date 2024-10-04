<script setup lang="ts">
import { useStreamerbot } from '@streamerbot/vue';

const host = ref<string>('127.0.0.1');
const port = ref<number>(8080);
const endpoint = ref<string>('/');

const {
  client,
  status,
  data,
  error,
  connect,
  disconnect,
} = useStreamerbot({
  host,
  port,
  endpoint
});

// Disconnect on config change
watch([host, port, endpoint], () => disconnect());

function reconnect() {
  disconnect();
  connect();
}

const clientOptionsCode = computed(() => {
  return `const client = new StreamerbotClient({
  host: '${host.value}',
  port: ${port.value},
  endpoint: '${endpoint.value}'
});`;
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <UCard class="w-auto">
      <template #header>
        <h3 class="text-lg font-semibold">
          Streamer.bot Client Options
        </h3>
      </template>

      <div class="flex gap-1">
        <UFormGroup label="Host">
          <UInput v-model="host" placeholder="127.0.0.1" />
        </UFormGroup>
        <UFormGroup label="Port">
          <UInput v-model.number="port" placeholder="8080" />
        </UFormGroup>
        <UFormGroup label="Endpoint">
          <UInput v-model="endpoint" placeholder="/" />
        </UFormGroup>
      </div>

      <template #footer>
        <div v-if="status === 'CLOSED'">
          <UButton color="gray" block trailing-icon="i-mdi-wifi" @click="() => reconnect()">
            Connect
          </UButton>
        </div>
        <div v-else-if="status === 'OPEN'">
          <UButton color="red" variant="soft" block trailing-icon="i-mdi-close-circle" @click="() => disconnect()">
            Disconnect
          </UButton>
        </div>
        <div v-else>
          <UButton color="gray" block disabled>
            Connecting...
          </UButton>
        </div>
      </template>
    </UCard>

    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          Example Code
        </h3>
      </template>
      <pre><code>{{ clientOptionsCode }}</code></pre>
    </UCard>
  </div>

  <UAlert v-if="error" title="WebSocket Error" :description="error" color="red" variant="soft" class="mt-3" />

  <template v-if="status === 'OPEN'">
    <div class="flex flex-wrap gap-1 my-3">
      <UButton color="gray" @click="() => client.getInfo()">Get Info</UButton>
      <UButton color="gray" @click="() => client.getEvents()">Get Events</UButton>
      <UButton color="gray" @click="() => client.getActions()">Get Actions</UButton>
      <UButton color="gray" @click="() => client.getBroadcaster()">Get Broadcaster</UButton>
      <UButton color="gray" @click="() => client.getCredits()">Get Credits</UButton>
      <UButton color="gray" @click="() => client.getActiveViewers()">Get Active Viewers</UButton>
      <UButton color="gray" @click="() => client.getCodeTriggers()">Get Code Triggers</UButton>
      <UButton color="gray" @click="() => client.getCommands()">Get Commands</UButton>
      <UButton color="gray" @click="() => client.twitchGetEmotes()">Get Emotes (Twitch)</UButton>
      <UButton color="gray" @click="() => client.youtubeGetEmotes()">Get Emotes (YouTube)</UButton>
    </div>
    <UCard class="mt-3">
      <template #header>
        <h3 class="text-lg font-semibold">Last Message Received</h3>
      </template>
      <pre><code>{{ data }}</code></pre>
    </UCard>
  </template>
</template>