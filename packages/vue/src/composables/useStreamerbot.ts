import {
  StreamerbotClient,
  StreamerbotClientOptions,
  StreamerbotInfo,
  WebSocketStatus
} from '@streamerbot/client';
import { Ref, ref, toValue, MaybeRef, isRef, computed, watch, onMounted, onBeforeUnmount } from 'vue-demi';

export type MaybeRefs<T> = { [P in keyof T]: Ref<T[P]> | T[P] };
export type UseStreamerbotOptions = Partial<MaybeRefs<StreamerbotClientOptions>> | MaybeRef<Partial<MaybeRefs<StreamerbotClientOptions>>>;

export type UseStreamerbotReturn = {
  data: Ref<any>;
  status: Ref<WebSocketStatus>;
  error: Ref<string | undefined>;
  connect: () => void;
  disconnect: () => void;
  client: Ref<StreamerbotClient | undefined>;
}

export function useStreamerbot(options: UseStreamerbotOptions): UseStreamerbotReturn {
  const _options = computed(() => isRef<Partial<MaybeRefs<StreamerbotClientOptions>>>(options) ? options.value : options);
  const _optionsChanged = ref(false);
  watch(options, () => {
    _optionsChanged.value = true;
    console.debug('Options changed...');
  }, { deep: true });

  const data = ref();
  const status = ref<WebSocketStatus>('CLOSED');
  const error = ref<string>();
  const clientRef = ref<StreamerbotClient>();

  function onConnect(data: StreamerbotInfo) {
    status.value = 'OPEN';
    error.value = undefined;
    let cb = toValue(_options.value.onConnect);
    cb?.(data);
  }

  function onDisconnect() {
    status.value = 'CLOSED';
    let cb = toValue(_options.value.onDisconnect);
    cb?.();
  }

  function onError(err: Error) {
    error.value = err?.message ?? 'Unkown Error';
    status.value = 'CLOSED';
    let cb = toValue(_options.value.onError);
    cb?.(err);
  }

  function onData(payload: any) {
    data.value = payload;
    let cb = toValue(_options.value.onData);
    cb?.(payload);
  }

  async function connect() {
    await disconnect();
    status.value = 'CONNECTING';
    if (_optionsChanged.value) {
      await _init(true);
    } else {
      await clientRef.value?.connect();
    }
  }

  async function disconnect() {
    if (!clientRef.value) return;
    try {
      clientRef.value.disconnect();
    } catch (e) {
      console.error(e);
    }
    status.value = 'CLOSED';
  }

  let _client: StreamerbotClient | undefined;
  async function _init(immediate: boolean = false) {
    if (clientRef.value) {
      await disconnect();
      clientRef.value = undefined;
    }
    console.debug('Initializing Streamer.bot Client...');

    if (immediate) status.value = 'CONNECTING';

    _client = new StreamerbotClient({
      scheme: toValue(_options.value.scheme) || 'ws',
      host: toValue(_options.value.host) || '127.0.0.1',
      port: toValue(_options.value.port) || 8080,
      endpoint: toValue(_options.value.endpoint) || '/',
      password: toValue(_options.value.password) || '',
      immediate: immediate,
      subscribe: toValue(_options.value.subscribe),
      autoReconnect: toValue(_options.value.autoReconnect) ?? true,
      retries: toValue(_options.value.retries) ?? -1,
      onConnect,
      onDisconnect,
      onError,
      onData
    });
    clientRef.value = _client;
    _optionsChanged.value = false;
  }

  onMounted(() => {
    _init(toValue(_options.value.immediate));
  });

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    data,
    status,
    error,
    connect,
    disconnect,
    client: clientRef
  }
}