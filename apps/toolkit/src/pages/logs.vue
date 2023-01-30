<script setup lang="ts">
import { debouncedRef } from '@vueuse/shared';
import { computed, ref } from 'vue';
import ToolkitCodePreview from '../components/ToolkitCodePreview.vue';
import { useStreamerbot } from '../composables/Streamerbot';

const { logs } = useStreamerbot();

const headers = [
  { title: 'Timestamp', key: '_time', width: '175px' },
  { title: 'Source', key: 'event.source' },
  { title: 'Event', key: 'event.type' },
  { title: '', key: 'actions', width: '100px', sortable: false, filterable: false },
];
const sortBy = ref<Array<{ key: string, order: 'asc'|'desc' }>>([
  { key: '_time', order: 'desc' }
]);
const search = ref<string>('');
const debouncedSearch = debouncedRef(search, 200);
const selectedItem = ref<any>();

const page = ref<number>(1);
const itemsPerPage = ref<number>(25);
const pageCount = computed(() => {
  return (logs.value.length % itemsPerPage.value) === 0
    ? Math.ceil(logs.value.length / itemsPerPage.value) + 1
    : Math.ceil(logs.value.length / itemsPerPage.value)
});
const paginationText = computed(() => {
  const start = ((page.value - 1) * itemsPerPage.value) + 1;
  const end = page.value * Math.min(logs.value.length, itemsPerPage.value);
  return `${start}-${end} of ${logs.value.length}`
})

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleString();
}

function customFilter(value: any, query: string, item: any): boolean {
  if (!query) return true;

  if (typeof value?._search === 'string') {
    console.log(value?._search, query, value?._search.match(new RegExp(`${query}`, 'gi')), value?._search.match(new RegExp(`${query}`, 'gi')) ? true : false);
    return value?._search.match(new RegExp(`${query}`, 'gi')) ? true : false;
  }

  return false;
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="7">
        <v-data-table
          v-model:sortBy="sortBy"
          v-model:page="page"
          v-model:itemsPerPage="itemsPerPage"
          :headers="headers"
          :items="logs"
          :search="debouncedSearch"
          :custom-filter="customFilter"
          filter-mode="some"
          density="compact"
          must-sort
        >
          <template #top>
            <v-toolbar color="surface" density="compact" style="border-bottom: 1px solid rgba(255,255,255,0.05)">
              <div class="flex-grow-1">
                <v-text-field
                  v-model="search"
                  variant="solo"
                  label="Search..."
                  color="primary"
                  hide-details
                  clearable
                  density="compact"
                >
                  <template #prepend-inner>
                    <Icon icon="mdi:search" height="26" class="mr-2 mb-1" color="grey" />
                  </template>
                </v-text-field>
              </div>
            </v-toolbar>
          </template>

          <template #bottom>
            <v-toolbar color="surface" density="compact" style="border-top: 1px solid rgba(255,255,255,0.05)">
              <v-toolbar-items class="d-flex align-center px-3">
                <small class="text-grey">Items per page</small>
                <v-select
                  v-model="itemsPerPage"
                  density="compact"
                  variant="solo"
                  hide-details
                  :items="[10, 25, 50]"
                />
              </v-toolbar-items>
              <v-divider vertical />
              <v-spacer />
              <v-divider vertical />
              <v-toolbar-items class="d-flex align-center px-3">
                <small class="text-grey">{{ paginationText }}</small>
              </v-toolbar-items>
              <v-divider vertical />
              <v-toolbar-items class="d-flex align-center px-3">
                <v-btn icon size="x-small" :disabled="page <= 1" @click="page = 1">
                  <Icon icon="mdi:page-first" height="18" />
                </v-btn>
                <v-btn icon size="x-small" :disabled="page <= 1" @click="page--">
                  <Icon icon="mdi:chevron-left" height="18" />
                </v-btn>
                <v-btn icon size="x-small" :disabled="page === pageCount" @click="page++">
                  <Icon icon="mdi:chevron-right" height="18" />
                </v-btn>
                <v-btn icon size="x-small" :disabled="page === pageCount" @click="page = pageCount">
                  <Icon icon="mdi:page-last" height="18" />
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
          </template>

          <template #item._time="{ item }">
            <small class="text-grey">
              <code>{{ formatTime(item.raw._time) }}</code>
            </small>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              size="x-small"
              variant="tonal"
              class="d-flex align-center pt-1 mb-1"
              color="primary"
              :disabled="selectedItem === item.raw"
              @click="selectedItem = item.raw"
            >
              <span>Details</span>
              <Icon icon="mdi:chevron-right" height="15" class="ml-1" style="margin-bottom: 2px;" />
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" lg="5">
        <v-card>
          <v-card-title class="font-weight-light">
            Details
          </v-card-title>
          <v-divider />
          <v-card-text>
            <template v-if="selectedItem">
              <ToolkitCodePreview v-model="selectedItem" />
            </template>
            <template v-else>
              <p class="text-grey">Select an item in the list to view details</p>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(.v-data-table) {
  --v-theme-surface: var(--v-theme-background-darken-1);
  font-size: 0.85em;
}

:deep(th.v-data-table__th) {
  background: #0b0c0c !important;
  padding-top: 5px !important;
  font-weight: 400 !important;
}

:deep(th.v-data-table__th--sorted) {
  color: #FFFFFFDE !important;
}

:deep(td.v-data-table__td) {
  padding-top: 5px !important;
}

:deep(.v-field--variant-solo) {
  box-shadow: none !important;
  border-radius: 0;
  background-color: rgb(var(--v-theme-background-lighten-1));
}
</style>