import {
  DefaultStreamerbotClientOptions,
  GetBroadcasterResponse,
  StreamerbotAction,
  StreamerbotClient,
  StreamerbotInfo,
  StreamerbotViewer
} from '@streamerbot/client';
import { createSharedComposable, useStorage } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';
import { computed, onMounted, ref } from 'vue';

export const useStreamerbot = createSharedComposable(() => {
  // local config
  const newConnection = useStorage('sb:toolkit:new', true);
  const host = useStorage(
    'sb:toolkit:host',
    DefaultStreamerbotClientOptions.host
  );
  const port = useStorage(
    'sb:toolkit:port',
    DefaultStreamerbotClientOptions.port
  );
  const endpoint = useStorage(
    'sb:toolkit:endpoint',
    DefaultStreamerbotClientOptions.endpoint
  );
  const uri = computed(() => `${host.value}:${port.value}${endpoint.value}`);

  // streamerbot client
  const client = ref<StreamerbotClient>();
  const error = ref<string | null>(null);
  const isConnected = ref<boolean>(false);
  const isConnecting = ref<boolean>(false);

  const instance = ref();
  const actions = ref<Array<StreamerbotAction>>();
  const variables = ref<Array<any>>();
  const activeViewers = ref<Array<StreamerbotViewer>>();
  const broadcaster = ref<GetBroadcasterResponse>();

  const logs = useStorage<
    Array<{
      id: string;
      title: string;
      timeStamp: string;
      event: {
        source: string;
        type: string;
      };
      data: any;
    }>
  >('sb:toolkit:logs', []);

  async function connect() {
    error.value = null;
    isConnecting.value = true;

    if (client.value) {
      await client.value?.disconnect();
    }

    client.value = new StreamerbotClient({
      host: host.value,
      port: port.value,
      endpoint: endpoint.value,
      subscribe: '*',
      onConnect,
      onDisconnect,
      onData,
      onError,
    });

    try {
      await client.value.connect();
    } catch (e) {
      error.value = 'WebSocket Error';
    }
  }

  onMounted(() => {
    if (!newConnection.value) {
      connect();
    }
  });

  async function onConnect(data: StreamerbotInfo) {
    error.value = null;

    // save instance info
    instance.value = data;

    // load data
    actions.value = (await client.value?.getActions())?.actions ?? [];
    broadcaster.value = await client.value?.getBroadcaster();

    // update connecting values
    isConnected.value = true;
    isConnecting.value = false;

    // toggle flag to reconnect next time automatically
    newConnection.value = false;

    // attach listeners to update actions on change
    client.value?.on('Application.*', async (data) => {
      actions.value = (await client.value?.getActions())?.actions ?? [];
    });
  }

  async function onDisconnect() {
    isConnected.value = false;
    isConnecting.value = false;
  }

  async function onData(data: any) {
    if (data && (data._time || data.timeStamp) && data.event) {
      // normalize timestamp
      data._time =
        data._time || new Date(data.timeStamp).getTime() || Date.now();

      // add our own unique id and title for indexing/searching
      data.id = data.id ?? uuidv4();

      // add custom string for search text
      data._search = `${data.event.source} - ${data.event.type}`;

      logs.value.push(data);
    }
  }

  async function onError(err: Error) {
    error.value = err.message;
  }

  return {
    host,
    port,
    endpoint,
    uri,
    connect,
    client,
    instance,
    actions,
    variables,
    activeViewers,
    broadcaster,
    logs,
    isConnected,
    isConnecting,
    error,
  };
});
