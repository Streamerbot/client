<script setup lang="ts">
import { ref } from 'vue';
import { useStreamerbot } from '../composables/Streamerbot';

const show = ref<boolean>(false);
const { logs } = useStreamerbot();

function formatTime(timeStamp: string) {
  return new Date(timeStamp).toLocaleTimeString();
}
</script>

<template>
  <v-navigation-drawer v-model="show" location="right" width="500" class="pa-3">
    <v-card>
      <v-card-title class="font-weight-light">Log Viewer</v-card-title>
      <v-divider />
      <v-card-text>
        <div v-for="log in logs">
          <code class="text-grey-darken-1">{{ formatTime(log.timeStamp) }}</code>
          <v-divider vertical class="mx-2" />
          <code class="text-grey-lighten-1">{{ log.event.source }}</code>
          <v-divider vertical class="mx-2" />
          <code class="text-grey-lighten-2">{{ log.event.type }}</code>
        </div>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>