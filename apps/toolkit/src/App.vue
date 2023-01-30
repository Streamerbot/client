<script setup lang="ts">
import ToolkitConnectView from './components/ToolkitConnectView.vue';
import ToolkitNavigationDrawer from './components/ToolkitNavigationDrawer.vue';
import ToolkitToolbar from './components/ToolkitToolbar.vue';
import { useStreamerbot } from './composables/Streamerbot';

const { instance, isConnected } = useStreamerbot();
</script>

<template>
  <v-app>
    <ToolkitToolbar />

    <template v-if="instance">
      <ToolkitNavigationDrawer />
      <v-main>
        <RouterView />
      </v-main>
    </template>
    <template v-else-if="!isConnected">
      <v-main>
        <ToolkitConnectView />
      </v-main>
    </template>
  </v-app>
</template>

<style scoped>

</style>
