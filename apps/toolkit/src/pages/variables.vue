<script setup lang="ts">
import { useStreamerbot } from '../composables/Streamerbot';

const { client } = useStreamerbot();

async function getGlobalVariable() {
  client.value?.doAction("b12f649e-781a-4ad5-aaef-84f1c87f21dc", {
    name: "test"
  });
}

async function setGlobalVariable() {
  client.value?.doAction("fac36342-8ee6-4a94-b4c7-a32dbe357480", {
    name: "test",
    value: "test value"
  });
}
</script>

<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Get Global Variable</v-card-title>
      <v-card-text>
        <v-text-field
          label="Name"
        />
      </v-card-text>
      <v-btn block variant="tonal" @click.prevent="getGlobalVariable">Submit</v-btn>
    </v-card>

    <v-card>
      <v-card-title>Set Global Variable</v-card-title>
      <v-card-text>
        <v-text-field
          label="Name"
        />
        <v-text-field label="Value"

        />
      </v-card-text>
      <v-btn block variant="tonal" @click.prevent="setGlobalVariable">Submit</v-btn>
    </v-card>
  </v-container>
</template>