<script setup lang="ts">
import ToolkitConnectView from './components/ToolkitConnectView.vue';
import ToolkitNavigationDrawer from './components/ToolkitNavigationDrawer.vue';
import ToolkitToolbar from './components/ToolkitToolbar.vue';
import { useStreamerbotStore } from './stores/streamerbot.store';

const store = useStreamerbotStore();
</script>

<template>
  <v-app>
    <ToolkitToolbar />

    <template v-if="store.isConnected && store.instance">
      <ToolkitNavigationDrawer />
      <v-main>
        <RouterView />
      </v-main>
    </template>
    <template v-else-if="!store.isConnected">
      <v-main>
        <ToolkitConnectView />
      </v-main>
    </template>
  </v-app>
</template>

<style scoped>

</style>
