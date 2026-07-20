<script setup lang="ts">
import type { StreamerbotClientOptions } from '@streamerbot/client';
import { useStreamerbot } from '@streamerbot/vue';

const state = ref<Partial<StreamerbotClientOptions>>({
  host: '127.0.0.1',
  port: 8080,
  endpoint: '/',
  password: '',
  immediate: false,
  logLevel: 'verbose',
});

const { client, status, data, error, connect, disconnect } = useStreamerbot(state);

// Disconnect on config change
watch(state, () => disconnect(), { deep: true });

async function reconnect() {
  try {
    await disconnect();
    await connect();
  } catch (e) {
    console.error(e);
  }
}

const clientOptionsCode = computed(() => {
  return `const client = new StreamerbotClient({
  host: '${state.value.host}',
  port: ${state.value.port},
  endpoint: '${state.value.endpoint}',
  password: '${state.value.password?.replace(/./g, '*')}',
});`;
});

const lastRequestResponse = ref<any>();

watch(client, (client) => {
  if (!client) return;
  client.on('Twitch.ChatMessage', (data) => console.log('Twitch.Chat', data));
});
</script>

<template>
  <NuxtErrorBoundary>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <UCard class="w-auto">
        <template #header>
          <h3 class="font-logo font-semibold tracking-tight">Streamer.bot Client Options</h3>
        </template>
        <UForm :state class="grid grid-rows-2 grid-cols-12 gap-3" @submit="() => reconnect()">
          <div class="grid grid-cols-subgrid col-span-12">
            <UFormField label="Host" class="col-span-6">
              <UInput v-model="state.host" placeholder="127.0.0.1" />
            </UFormField>
            <UFormField label="Port" class="col-span-3">
              <UInput v-model.number="state.port" placeholder="8080" />
            </UFormField>
            <UFormField label="Endpoint" class="col-span-3">
              <UInput v-model="state.endpoint" placeholder="/" />
            </UFormField>
          </div>
          <div class="col-span-full">
            <UFormField label="Password" hint="Optional">
              <UInput v-model="state.password" type="password" autocomplete="none" />
            </UFormField>
          </div>
        </UForm>
        <template #footer>
          <div v-if="status !== 'OPEN'">
            <UButton
              color="neutral"
              variant="subtle"
              size="sm"
              block
              trailing-icon="i-mdi-send"
              :loading="status === 'CONNECTING'"
              @click="() => reconnect()"
            >
              Connect
            </UButton>
          </div>
          <div v-else-if="status === 'OPEN'">
            <UButton
              color="error"
              variant="subtle"
              block
              trailing-icon="i-mdi-close-circle"
              @click="() => disconnect()"
            >
              Disconnect
            </UButton>
          </div>
          <div v-else>
            <UButton color="neutral" block disabled> Connecting... </UButton>
          </div>
        </template>
      </UCard>
      <UCard>
        <template #header>
          <h3 class="font-logo font-semibold tracking-tight">Example Code</h3>
        </template>
        <pre><code>{{ clientOptionsCode }}</code></pre>
      </UCard>
    </div>
    <UAlert
      v-if="error"
      title="WebSocket Error"
      :description="error"
      color="red"
      variant="soft"
      class="mt-3"
    />
    <template v-if="client && status === 'OPEN'">
      <UCard class="my-3">
        <template #header>
          <h3 class="font-logo font-semibold tracking-tight">Test Client Requests</h3>
        </template>
        <div class="grid grid-cols-3 gap-3">
          <div class="flex flex-col gap-1">
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getInfo())"
              >Get Info</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getEvents())"
              >Get Events</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getActions())"
              >Get Actions</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getBroadcaster())"
              >Get Broadcaster</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getCredits())"
              >Get Credits</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getActiveViewers())"
              >Get Active Viewers</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getCodeTriggers())"
              >Get Code Triggers</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getCommands())"
              >Get Commands</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getEmotes('twitch'))"
              >Get Emotes (Twitch)</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getEmotes('youtube'))"
              >Get Emotes (YouTube)</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getGlobals())"
              >Get Globals</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="async () => (lastRequestResponse = await client.getGlobal('test'))"
              >Get Global (test)</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="
                async () => (lastRequestResponse = await client.getUserGlobals('twitch', 'test'))
              "
              >Get Twitch User Globals (test)</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="
                async () => (lastRequestResponse = await client.getUserGlobal('twitch', '54601714'))
              "
              >Get Twitch User Global</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="
                async () =>
                  (lastRequestResponse = await client.getUserGlobal('twitch', '54601714', 'test'))
              "
              >Get Twitch User Global (test)</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="
                async () =>
                  (lastRequestResponse = await client.sendMessage('twitch', 'test', {
                    bot: false,
                    internal: false,
                  }))
              "
              >Send Twitch Chat Message</UButton
            >
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:send"
              size="xs"
              block
              class="cursor-pointer"
              @click="
                async () =>
                  (lastRequestResponse = await client.getUserPronouns('twitch', 'whipstickgostop'))
              "
              >Get User Pronouns</UButton
            >
          </div>
          <div
            class="col-span-2 p-3 rounded-lg bg-muted/50 ring-1 ring-muted max-h-[600px] overflow-auto"
          >
            <code class="whitespace-pre text-sm">{{ lastRequestResponse }}</code>
          </div>
        </div>
      </UCard>
      <UCard class="mt-3">
        <template #header>
          <h3 class="font-logo font-semibold tracking-tight">Last Message Received (Raw)</h3>
        </template>
        <code class="whitespace-pre">{{ data }}</code>
      </UCard>
    </template>
  </NuxtErrorBoundary>
</template>
