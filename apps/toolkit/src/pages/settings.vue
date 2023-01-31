<script setup lang="ts">
import ToolkitConnectForm from '../components/ToolkitConnectForm.vue';
import { useStreamerbotStore } from '../stores/streamerbot.store';

const store = useStreamerbotStore();
</script>

<template>
  <v-container fluid>
    <v-toolbar v-if="store.instance" flat color="surface" class="rounded-t-lg bg mb-3" height="100">
      <v-toolbar-title class="d-flex flex-column">
        <span class="d-flex align-center">
          <span>{{ store.instance.name ?? 'Streamer.bot' }}</span>
          <v-chip label :color="store.isConnected ? 'success' : 'error'" size="small" class="mx-3 mb-1 font-weight-bold">
            <Icon icon="mdi:circle-slice-8" class="mr-1" />
            {{ store.isConnected ? 'Online' : 'Offline' }}
          </v-chip>
        </span>
        <div class="d-flex align-center text-grey" style="font-size: 0.8em;">
          <small>{{ store.instance.instanceId }}</small>
          <small class="mx-2">•</small>
          <Icon height="12" class="mr-1" :icon="
            store.instance.os === 'windows'  ? 'mdi:microsoft-windows'
            : store.instance.os === 'linux' ? 'mdi:linux'
            : store.instance.os === 'macosx' ? 'mdi:apple'
            : 'mdi:help-circle-outline'
          " />
          <small class="text-capitalize">{{ store.instance.os }}</small>
          <small class="mx-2">•</small>
          <small>v{{ store.instance.version }}</small>
        </div>
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>

    {{ store.status }}

    <v-row>
      <v-col cols="12" lg="6" xl="4">
        <v-card>
          <v-card-title class="font-weight-light">Settings</v-card-title>
          <v-divider />
          <v-card-text>
            <ToolkitConnectForm />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" xl="4">
        <v-card>
          <v-card-title class="font-weight-light">Debug</v-card-title>
          <v-divider />
          <v-card-text>
            <v-btn block variant="tonal" color="primary" @click="store.clearLogs()">Clear Logs</v-btn>

            <v-btn
              block
              variant="tonal"
              color="primary"
              class="mt-3"
              :disabled="!store.isConnected"
              @click="store.client?.getEvents()"
            >GetEvents</v-btn>
            <v-btn
              block
              variant="tonal"
              color="primary"
              class="mt-3"
              :disabled="!store.isConnected"
              @click="store.client?.getBroadcaster()"
            >GetBroadcaster</v-btn>
            <v-btn
              block
              variant="tonal"
              color="primary"
              class="mt-3"
              :disabled="!store.isConnected"
              @click="store.client?.getCredits()"
            >GetCredits</v-btn>

            <v-btn
              block
              variant="tonal"
              color="primary"
              class="mt-3"
              :disabled="!store.isConnected"
              @click="store.client?.testCredits()"
            >TestCredits</v-btn>

            <v-btn
              block
              variant="tonal"
              color="primary"
              class="mt-3"
              :disabled="!store.isConnected"
              @click="store.client?.clearCredits()"
            >ClearCredits</v-btn>

            <v-btn
              block
              variant="tonal"
              color="primary"
              class="mt-3"
              :disabled="!store.isConnected"
              @click="store.client?.getInfo()"
            >GetInfo</v-btn>
            <v-btn
              block
              variant="tonal"
              color="primary"
              class="mt-3"
              :disabled="!store.isConnected"
              @click="store.client?.getActiveViewers()"
            >GetActiveViewers</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(.v-toolbar__extension) {
  border-top: 1px solid rgba(168,168,168,0.1);
}
</style>