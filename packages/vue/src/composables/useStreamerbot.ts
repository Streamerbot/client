import {
  StreamerbotClient,
  StreamerbotClientOptions,
  StreamerbotInfo,
  WebSocketStatus
} from '@streamerbot/client';
import { Ref, ref, unref } from 'vue-demi';

export type MaybeRefs<T> = { [P in keyof T]: Ref<T[P]> | T[P] };
export type UseStreamerbotOptions = MaybeRefs<StreamerbotClientOptions>;

export type UseStreamerbotReturn = {
  data: Ref<any>;
  status: Ref<WebSocketStatus>;
  error: Ref<string | undefined>;
  connect: () => void;
  disconnect: () => void;
  client: Ref<StreamerbotClient | undefined>;
}

export function useStreamerbot(options: Partial<UseStreamerbotOptions> = {}): UseStreamerbotReturn {
  const data = ref();
  const status = ref<WebSocketStatus>('CLOSED');
  const error = ref<string>();
  const clientRef = ref<StreamerbotClient>();

  function onConnect(data: StreamerbotInfo) {
    status.value = 'OPEN';
    error.value = undefined;
    let cb = unref(options.onConnect);
    if (cb) cb(data);
  }

  function onDisconnect() {
    status.value = 'CLOSED';
    let cb = unref(options.onDisconnect);
    if (cb) cb();
  }

  function onError(err: Error) {
    error.value = err?.message ?? 'Unkown Error';
    status.value = 'CLOSED';
    let cb = unref(options.onError);
    if (cb) cb(err);
  }

  function onData(payload: any) {
    data.value = payload;
    let cb = unref(options.onData);
    if (cb) cb(payload);
  }

  async function connect() {
    await disconnect();
    _init(true);
  }

  async function disconnect() {
    if (!clientRef.value) return;
    await clientRef.value.disconnect();
    clientRef.value = undefined;
  }

  let _client: StreamerbotClient | undefined;
  function _init(immediate: boolean = false) {
    console.log('Initializing Streamer.bot Client...');

    if (immediate) status.value = 'CONNECTING';

    _client = new StreamerbotClient({
      scheme: unref(options.scheme) ?? 'ws',
      host: unref(options.host) ?? '127.0.0.1',
      port: unref(options.port) ?? 8080,
      endpoint: unref(options.endpoint) ?? '/',
      immediate: (immediate || unref(options.immediate)) ?? true,
      subscribe: unref(options.subscribe),
      autoReconnect: unref(options.autoReconnect) ?? true,
      retries: unref(options.retries) ?? -1,
      onConnect,
      onDisconnect,
      onError,
      onData
    });
    clientRef.value = _client;
  }

  if (unref(options.immediate))
    connect();

  return {
    data,
    status,
    error,
    connect,
    disconnect,
    client: clientRef
  }
}