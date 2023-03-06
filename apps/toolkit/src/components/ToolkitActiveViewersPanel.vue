<script setup lang="ts">
import { onMounted } from 'vue';
import { useStreamerbotStore } from '../stores/streamerbot.store';

const store = useStreamerbotStore();

onMounted(() => store.fetchActiveViewers());

function formatTime(timeStamp: string) {
  return new Date(timeStamp).toLocaleTimeString();
}

function isYouTubeViewer(viewerId: string | number) {
  return typeof viewerId === 'number' && !isNaN(viewerId);
}
</script>

<template>
  <v-card>
    <v-card-title class="font-weight-light d-flex">
      <span>Active Viewers</span>
      <v-btn icon size="x-small" variant="tonal" color="primary" class="ml-auto" @click="store.fetchActiveViewers">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider class="mx-2" />
    <v-card-text class="pa-0">
      <v-list density="compact">
        <v-dialog v-for="viewer in store.activeViewers" max-width="50rem" transition="dialog-bottom-transition">
          <template #activator="{ props }">
            <v-list-item :key="viewer.id" v-bind="props">
              <v-list-item-title>{{ viewer.display }}</v-list-item-title>
              <v-list-item-subtitle class="mt-n1"><small>{{ viewer.role }}</small></v-list-item-subtitle>

              <template v-if="isYouTubeViewer(viewer.id)" #append>
                <v-icon>mdi-youtube</v-icon>
              </template>
            </v-list-item>
          </template>
          <template #default="{ isActive }">
            <v-card>
              <v-toolbar color="primary" :title="viewer.display"></v-toolbar>
              <v-card-text>
                <v-chip class="ma-2" color="primary" label>
                  {{ viewer.role }}
                </v-chip>
                <v-chip v-if="viewer.subscribed" class="ma-2" color="primary" label>
                  Subscribed
                </v-chip>
                <v-chip v-if="viewer.exempt" class="ma-2" color="primary" label>
                  Timeout Exempt
                </v-chip>
                <v-table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Display</td>
                      <td>{{ viewer.display }}</td>
                    </tr>
                    <tr>
                      <td>Login</td>
                      <td>{{ viewer.login }}</td>
                    </tr>
                    <tr>
                      <td>User Id</td>
                      <td>{{ viewer.id }}</td>
                    </tr>
                    <tr>
                      <td>Previous Active</td>
                      <td>{{ formatTime(viewer.previousActive) }}</td>
                    </tr>
                    <tr v-if="!isYouTubeViewer(viewer.id)">
                      <td>Channel Points Used</td>
                      <td>{{ viewer.channelPointsUsed }}</td>
                    </tr>
                    <tr v-if="viewer.groups.length > 0">
                      <td>Groups</td>
                      <td>
                        <v-chip v-for="group in viewer.groups" class="ma-2" color="primary" label>
                          {{ group }}
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn variant="text" @click="isActive.value = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-list>
    </v-card-text>
  </v-card>
</template>
