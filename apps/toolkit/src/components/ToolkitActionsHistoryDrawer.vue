<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStreamerbot } from '../composables/Streamerbot';
import ToolkitCodePreview from './ToolkitCodePreview.vue';

const show = ref<boolean>(true);
const { logs } = useStreamerbot();

const actionsHistory = computed(() => {
  const map = new Map<string, any[]>();
  logs.value
    .filter(log => log.event.source === 'Raw' && ['Action', 'ActionCompleted', 'SubAction'].includes(log.event.type))
    .reverse()
    .forEach((log) => {
      map.set(log.data.id, [...map.get(log.data.id) ?? [], log])
    });
  return map;
});

const selectedActionId = ref<string>();
const selectedAction = computed(() => {
  if (!selectedActionId.value) return;
  return actionsHistory.value.get(selectedActionId.value);
});

function formatTime(timeStamp: string) {
  return new Date(timeStamp).toLocaleString();
}
</script>

<template>
  <v-navigation-drawer v-model="show" location="right" width="600" class="pa-3">
    <v-card elevation="0" class="pa-0">
      <v-card-title v-if="selectedAction" class="d-flex align-center">
        <v-btn size="small" variant="tonal" color="primary" @click="selectedActionId = undefined">
          <v-icon class="mr-1">mdi-chevron-left</v-icon>
          Back
        </v-btn>
        <v-spacer />
        <span>Running Action Log</span>
      </v-card-title>
      <template v-else>
        <v-card-title class="font-weight-light pb-0">Action History</v-card-title>
        <v-card-subtitle>Click item to view detailed history</v-card-subtitle>
      </template>
      <v-divider class="my-3" />
      <v-card-text>
        <v-fade-transition leave-absolute>
          <div v-if="selectedAction">
            <div class="py-3">
              <div class="text-subtitle">Timeline</div>
              <v-timeline side="end" flat>
                <v-timeline-item
                  v-for="log in selectedAction"
                  :key="log.id"
                  :dot-color="log.event.type === 'ActionCompleted' ? 'success'
                    : log.event.type === 'SubAction' ? 'warning'
                    : 'primary'
                  "
                  :icon="log.event.type === 'ActionCompleted' ? 'mdi-check'
                    : log.event.type === 'SubAction' ? 'mdi-lightning-bolt-outline'
                    : 'mdi-lightning-bolt'
                  "
                >
                  <template #opposite>
                    <div class="d-flex flex-column align-end">
                      <small class="text-grey-lighten-1">{{ log.event.type }}</small>
                      <small class="text-grey">{{ formatTime(log.timeStamp) }}</small>
                    </div>
                  </template>

                  <v-list-item class="px-0">
                    <v-list-item-title class="font-weight-light">
                      {{ log.data.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <small>{{ log.data.id }}</small>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-timeline-item>
              </v-timeline>
            </div>

            <v-divider class="my-3" />

            <div class="py-3">
              <div class="text-subtitle">Arguments</div>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-right">Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="arg, key in selectedAction.at(-1)?.data?.arguments ?? []">
                    <td class="text-right">{{ key }}</td>
                    <td>{{ arg }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <v-divider class="my-3" />

            <div class="py-3">
              <div class="text-subtitle">Raw Data</div>
              <ToolkitCodePreview :model-value="selectedAction" />
            </div>
          </div>

          <v-timeline v-else side="end" flat>
            <v-fade-transition group>
              <v-timeline-item
                v-for="[runningActionId, logs] in actionsHistory"
                :key="runningActionId"
                :dot-color="logs.find(log => log.event.type === 'ActionCompleted') ? 'success'
                  : logs.find(log => log.event.type === 'SubAction') ? 'warning'
                  : 'primary'
                "
                :icon="logs.find(log => log.event.type === 'ActionCompleted') ? 'mdi-check'
                  : logs.find(log => log.event.type === 'SubAction') ? 'mdi-lightning-bolt-outline'
                  : 'mdi-lightning-bolt'
                "
                class="clickable"
                @click="selectedActionId = runningActionId"
              >
                <template #opposite>
                  <div class="d-flex flex-column align-end">
                    <small class="text-grey-lighten-1">{{ logs[0].event.type }}</small>
                    <small class="text-grey">{{ formatTime(logs[0].timeStamp) }}</small>
                  </div>
                </template>

                <v-list-item class="px-0">
                  <v-list-item-title class="font-weight-light">
                    {{ logs[0].data.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <small>{{ logs[0].data.id }}</small>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-timeline-item>
            </v-fade-transition>
          </v-timeline>
        </v-fade-transition>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<style scoped>
.clickable {
  cursor: pointer;
}

.clickable:hover .v-list-item {
  background: rgb(var(--v-theme-background-lighten-1));
}
</style>