<script setup lang="ts">
import { onMounted } from 'vue';
import { useStreamerbotStore } from '../stores/streamerbot.store';

const store = useStreamerbotStore();

onMounted(() => store.fetchActiveViewers());
</script>

<template>
  <v-card>
    <v-card-title class="font-weight-light d-flex">
      <span>Active Viewers</span>
      <v-btn icon size="x-small" variant="tonal" color="primary" class="ml-auto" @click="store.fetchActiveViewers">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider class="mx-2" />
    <v-card-text class="pa-0">
      <v-list density="compact">
        <v-list-item
          v-for="viewer in store.activeViewers"
          :key="viewer.id"
        >
          <v-list-item-title>{{ viewer.display }}</v-list-item-title>
          <v-list-item-subtitle class="mt-n1"><small>{{ viewer.role }}</small></v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>