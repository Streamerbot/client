<script setup lang="ts">
import ToolkitActiveViewersPanel from '../components/ToolkitActiveViewersPanel.vue';
import ToolkitChatPanel from '../components/ToolkitChatPanel.vue';
import { useStreamerbotStore } from '../stores/streamerbot.store';

const store = useStreamerbotStore();
</script>

<template>
  <v-container fluid>
    <v-alert type="warning" variant="tonal" density="compact" class="mb-3">Work in Progress</v-alert>

    <v-toolbar color="surface" class="mb-3">
      <v-toolbar-title v-if="store.broadcaster?.platforms?.twitch">
        <v-avatar>
          <v-img v-if="store.broadcasterAvatar" :src="store.broadcasterAvatar" />
        </v-avatar>
        <span class="mx-2 mt-2">{{ store.broadcaster?.platforms.twitch?.broadcastUser }}</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-row>
      <v-col cols="12" lg="4" xl="3">
        <ToolkitActiveViewersPanel />
      </v-col>
      <v-col cols="12" lg="8" xl="9">
        <ToolkitChatPanel />
      </v-col>
    </v-row>
  </v-container>
</template>