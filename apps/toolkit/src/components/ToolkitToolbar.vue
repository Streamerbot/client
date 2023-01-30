<script setup lang="ts">
import { useStreamerbotStore } from '../stores/streamerbot.store';

const store = useStreamerbotStore();
</script>

<template>
  <v-app-bar density="compact" prominent flat>
    <v-toolbar-title class="d-flex flex-row">
      <v-icon size="25" class="mr-1 mb-1">
        <v-img src="https://streamer.bot/logo-transparent.svg" />
      </v-icon>
      <span class="font-weight-light text-grey-lighten-1">Streamer.bot</span>
      Toolkit
      <v-chip label variant="tonal" size="x-small" color="primary" class="mb-1 ml-2">Beta</v-chip>
    </v-toolbar-title>
    <v-spacer />
    <v-fade-transition>
      <template v-if="store.instance">
        <div class="d-flex text-grey-lighten-1 px-3">
          <template v-if="store.instance.name && !store.instance.name.match(/streamer\.bot/i)">
            <v-divider vertical class="mx-3" />
            <small class="text-grey-lighten-2">{{ store.instance.name }}</small>
          </template>
          <v-divider vertical class="mx-3" />
          <small class="text-grey-lighten-2">Streamer.bot</small>
          <small class="ml-1"><small>v</small>{{ store.instance.version }}</small>
          <v-divider vertical class="mx-3" />
          <v-chip label :color="store.isConnected ? 'success' : 'error'" size="x-small">
            <Icon icon="mdi:circle-slice-8" class="mr-1" />
            {{ store.isConnected ? 'Online' : 'Offline' }}
          </v-chip>
          <v-slide-x-reverse-transition leave-absolute>
            <v-btn v-if="!store.isConnected" size="x-small" class="pa-0" :loading="store.isConnecting" @click="store.connect">
              <Icon icon="mdi:refresh" />
            </v-btn>
          </v-slide-x-reverse-transition>
        </div>
      </template>
    </v-fade-transition>
  </v-app-bar>
</template>

<style scoped>
.v-toolbar {
  border-bottom: 1px solid rgba(168,168,168,0.1);
}
</style>