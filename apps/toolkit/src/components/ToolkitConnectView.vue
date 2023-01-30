<script setup lang="ts">
import ToolkitConnectForm from './ToolkitConnectForm.vue';
</script>

<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="12" lg="6" offset-lg="3">
        <v-card class="mx-auto" max-width="600">
          <v-card-title class="font-weight-light mt-3">Connect to Streamer.bot</v-card-title>
          <v-card-subtitle>The WebSocket server must be enabled in your <code>Servers/Clients</code> config</v-card-subtitle>

          <v-card-text>
            <ToolkitConnectForm />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>