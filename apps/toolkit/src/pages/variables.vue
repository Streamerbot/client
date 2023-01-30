<script setup lang="ts">
import { ref } from 'vue';
import { useStreamerbotStore } from '../stores/streamerbot.store';

const store = useStreamerbotStore();

const name = ref<string>();
const value = ref<string>();

async function getGlobalVariable() {
  store.client?.doAction({ name: '[Toolkit] Get Global Variable' }, {
    name: name.value
  });
}

async function setGlobalVariable() {
  store.client?.doAction({ name: '[Toolkit] Set Global Variable' }, {
    name: name.value,
    value: value.value,
  });
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <v-card>
          <v-card-title class="font-weight-light">Get Global Variable</v-card-title>
          <v-divider class="mx-3" />
          <v-card-text class="flex-grow-1">
            <v-text-field
              v-model="name"
              label="Name"
              density="compact"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn block variant="tonal" color="primary" class="mt-auto" @click.prevent="getGlobalVariable">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card>
          <v-card-title class="font-weight-light">Set Global Variable</v-card-title>
          <v-divider class="mx-3" />
          <v-card-text>
            <v-text-field
              v-model="name"
              label="Name"
              density="compact"
            />
            <v-text-field
              v-model="value"
              label="Value"
              density="compact"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn block variant="tonal" color="primary" @click.prevent="setGlobalVariable">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>