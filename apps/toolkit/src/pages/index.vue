<script setup lang="ts">
import { ref, watch } from 'vue';
import ToolkitActiveViewersPanel from '../components/ToolkitActiveViewersPanel.vue';
import ToolkitChatPanel from '../components/ToolkitChatPanel.vue';
import { useStreamerbot } from '../composables/Streamerbot';

const { broadcaster } = useStreamerbot();
const avatarUrl = ref<string>();

watch(broadcaster, () => {
  fetchAvatar(broadcaster.value?.platforms?.twitch?.broadcastUserName);
});

async function fetchAvatar(username: string = '') {
  if (!username) return;
  const res = await fetch(`https://decapi.me/twitch/avatar/${username}`, {
    mode: 'cors',
    credentials: 'omit'
  });
  avatarUrl.value = await res.text();
  return avatarUrl.value;
}
</script>

<template>
  <v-container fluid>
    <v-alert type="warning" variant="tonal" density="compact" class="mb-3">Work in Progress</v-alert>

    <v-toolbar color="surface" class="mb-3">
      <v-toolbar-title v-if="broadcaster?.platforms?.twitch">
        <v-avatar>
          <v-img v-if="avatarUrl" :src="avatarUrl" />
        </v-avatar>
        <span class="mx-2 mt-2">{{ broadcaster?.platforms.twitch?.broadcastUser }}</span>
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