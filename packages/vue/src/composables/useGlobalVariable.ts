import type { StreamerbotClient, StreamerbotVariableValue } from '@streamerbot/client';
import { inject, isRef, Ref, ref, watch, type MaybeRefOrGetter } from 'vue-demi';
import { INJECT_CLIENT, INJECT_CLIENT_STATUS } from '../utils/keys.util';

export type UseGlobalVariableOptions = {
  persisted?: boolean;
}

export function useGlobalVariable<
  T extends StreamerbotVariableValue = StreamerbotVariableValue
>(
  name: string,
  options: MaybeRefOrGetter<Partial<UseGlobalVariableOptions>> = {}
) {
  const client = inject<Ref<StreamerbotClient>>(INJECT_CLIENT);
  const status = inject<string | undefined>(INJECT_CLIENT_STATUS);
  if (!isRef(client) || !isRef(status)) throw new Error('StreamerbotClient not provided. Did you include useStreamerbot in app.vue or another parent component?');

  const _options = ref(typeof options === 'function' ? options() : options);

  const value = ref<T>();
  const lastWrite = ref<string>();

  watch(status, async (status) => {
    if (!client.value) return;

    if (status === 'OPEN') {
      try {
        await fetch();
      } catch (err) {
        console.error(err);
      }
    }
  }, { immediate: true });

  watch(client, (client) => {
    if (!client) return;

    client?.on('Misc.GlobalVariableUpdated', ({ data }) => {
      if ('name' in data && 'newValue' in data && 'lastWrite' in data && data.name === name) {
        value.value = data.newValue as T;
        lastWrite.value = data.lastWrite as string;
      }
    });
  }, { immediate: true });

  async function fetch() {
    const response = await client?.value?.getGlobal<T>(name, _options?.value.persisted !== false);
    if (response?.status === 'ok' && response.variable) {
      value.value = response.variable.value;
      lastWrite.value = response.variable.lastWrite;
    } else {
      console.warn('Failed to fetch global variable', name, response?.error);
    }
  }

  return {
    value,
  }
}