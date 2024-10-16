<script setup lang="ts">
import { useStreamerbot } from '@streamerbot/vue';
import { StreamerbotGlobalVariable } from '@streamerbot/vue/components';

const { status } = useStreamerbot({
  host: '127.0.0.1',
  port: 8080,
  endpoint: '/',
  immediate: true,
  autoReconnect: true,
});

const variables = [
  'latestFollower',
  'latestSubscriber',
  'latestCheer',
  'latestDonation',
];
</script>

<template>
  <div>
    <h3>Connection Status: &nbsp;<code>{{ status }}</code></h3>
    <table>
      <thead>
        <tr>
          <th :style="{ padding: '.2em', textAlign: 'right' }">Variable</th>
          <th :style="{ padding: '.2em', textAlign: 'left' }">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="name in variables" :key="name">
          <td :style="{ padding: '.2em', textAlign: 'right' }">{{ name }}</td>
          <td :style="{ padding: '.2em', textAlign: 'left' }">
            <code :style="{ border: '1px solid rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '5px' }">
              <StreamerbotGlobalVariable :name />
            </code>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
