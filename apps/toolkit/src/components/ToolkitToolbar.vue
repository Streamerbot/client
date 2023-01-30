<script setup lang="ts">
import { useStreamerbot } from '../composables/Streamerbot';

const { connect, isConnecting, instance, isConnected } = useStreamerbot();
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
      <template v-if="instance">
        <div class="d-flex text-grey-lighten-1 px-3">
          <template v-if="instance.name && !instance.name.match(/streamer\.bot/i)">
            <v-divider vertical class="mx-3" />
            <small class="text-grey-lighten-2">{{ instance.name }}</small>
          </template>
          <v-divider vertical class="mx-3" />
          <small class="text-grey-lighten-2">Streamer.bot</small>
          <small class="ml-1"><small>v</small>{{ instance.version }}</small>
          <v-divider vertical class="mx-3" />
          <v-chip label :color="isConnected ? 'success' : 'error'" size="x-small">
            <Icon icon="mdi:circle-slice-8" class="mr-1" />
            {{ isConnected ? 'Online' : 'Offline' }}
          </v-chip>
          <v-slide-x-reverse-transition leave-absolute>
            <v-btn v-if="!isConnected" size="x-small" class="pa-0" :loading="isConnecting" @click="connect">
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