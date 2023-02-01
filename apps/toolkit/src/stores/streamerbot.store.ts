import { DefaultStreamerbotClientOptions, GetBroadcasterResponse, StreamerbotAction, StreamerbotInfo, StreamerbotViewer } from '@streamerbot/client';
import { useStreamerbot } from '@streamerbot/vue';
import { useStorage } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import Timestamp from 'timestamp-nano';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, watch } from 'vue';

export const useStreamerbotStore = defineStore('streamerbot', () => {

  const MAX_LOGS_LENGTH = 1000;

  // Configuration (LocalStorage)
  const host = useStorage('sb:toolkit:host', DefaultStreamerbotClientOptions.host);
  const port = useStorage('sb:toolkit:port', DefaultStreamerbotClientOptions.port);
  const endpoint = useStorage('sb:toolkit:endpoint', DefaultStreamerbotClientOptions.endpoint);
  const isNewConnection = useStorage('sb:toolkit:new', true);

  // Client Connection State
  const { client, error, status, connect, data } = useStreamerbot({
    host,
    port,
    endpoint,
    immediate: !isNewConnection.value,
    subscribe: '*',
    onConnect,
  });
  const isConnected = computed(() => status.value === 'OPEN');
  const isConnecting = computed(() => status.value === 'CONNECTING');

  // Client Data
  const instance = useStorage<Partial<StreamerbotInfo>>('sb:toolkit:instance', {
    instanceId: undefined,
    name: undefined,
    os: undefined,
    version: undefined
  }, localStorage, { mergeDefaults: true });
  const actions = useStorage<Array<StreamerbotAction>>('sb:toolkit:actions', []);
  const variables = ref<Array<unknown>>();
  const activeViewers = ref<Array<StreamerbotViewer>>();
  const broadcaster = useStorage<Partial<GetBroadcasterResponse>>('sb:toolkit:broadcaster', {
    platforms: undefined,
    connected: [],
    disconnected: []
  }, localStorage, { mergeDefaults: true });
  const broadcasterAvatar = useStorage<string | null>('sb:toolkit:avatar', null);

  // Logger Data
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
  >('sb:toolkit:logs:v2', []);

  async function onConnect(data: StreamerbotInfo) {
    // save instance info
    instance.value = (data && data.instanceId) ? data : instance.value;

    // load data
    actions.value = (await client.value?.getActions())?.actions ?? [];
    broadcaster.value = await client.value?.getBroadcaster();

    // toggle flag to reconnect next time automatically
    isNewConnection.value = false;

    // attach listeners to update actions on change
    client.value?.on(['Application.*'], async () => {
      actions.value = (await client.value?.getActions())?.actions ?? [];
    });
  }

  async function fetchActions() {
    actions.value = (await client.value?.getActions())?.actions ?? [];
  }

  async function fetchActiveViewers() {
    activeViewers.value = (await client.value?.getActiveViewers())?.viewers;
  }

  async function fetchAvatar(username: string = '') {
    if (!username) return;
    const res = await fetch(`https://decapi.me/twitch/avatar/${username}`, {
      mode: 'cors',
      credentials: 'omit',
    });
    broadcasterAvatar.value = await res.text();
    return broadcasterAvatar.value;
  }

  function clearLogs(options: { type?: string } = {}) {
    if (options?.type) {
      logs.value = logs.value.filter(log => log.event.type !== options.type);
    } else {
      logs.value = [];
    }
  }

  watch(broadcaster, () => {
    fetchAvatar(broadcaster.value?.platforms?.twitch?.broadcastUserName);
  });

  watch(data, (val) => {
    if (val?.event) {
      // normalize timestamp
      val._time = Timestamp.fromDate(new Date())
        .addNano(performance.now())
        .toJSON();

      // add our own unique id and title for indexing/searching
      val.id = val.id ?? uuidv4();

      // add custom string for search text
      val._search = `${val.event.source} - ${val.event.type}`;

      logs.value.push(val);
    }

    if (logs.value?.length > MAX_LOGS_LENGTH) {
      logs.value.slice(-MAX_LOGS_LENGTH);
    }
  });

  return {
    status,
    host,
    port,
    endpoint,
    isNewConnection,
    client,
    connect,
    error,
    isConnected,
    isConnecting,
    instance,
    actions,
    variables,
    activeViewers,
    broadcaster,
    broadcasterAvatar,
    logs,
    fetchActions,
    fetchActiveViewers,
    fetchAvatar,
    clearLogs,
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStreamerbotStore, import.meta.hot));
}