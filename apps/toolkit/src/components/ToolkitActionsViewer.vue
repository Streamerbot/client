<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useStreamerbotStore } from '../stores/streamerbot.store';

const store = useStreamerbotStore();

watch(() => store.isConnected, async (val) => {
  if (val) {
    await store.fetchActions();
  }
}, { immediate: true });

const selectedActionsGroup = ref<string | null>('');
const actionsGroupMap = computed(() => {
  const map = new Map<string, any>();
  for (const action of store.actions ?? []) {
    if (!map.get(action.group)) map.set(action.group, []);
    map.get(action.group).push(action);
  }
  return map;
});
const groupNames = computed(() => {
  const keys = [...actionsGroupMap.value.keys() ?? []];
  return keys.sort((a, b) => {
    return (a ?? '').localeCompare(b ?? '');
  });
});
</script>

<template>
  <v-navigation-drawer>
    <v-card>
      <v-card-title class="font-weight-light">Action Groups</v-card-title>
      <v-divider class="mx-3" />
      <v-card-text class="pa-0">
        <v-list subheader nav density="compact" style="max-height: calc(100vh - 125px)">
          <v-list-item
            active-color="primary"
            :active="selectedActionsGroup === null"
            @click="selectedActionsGroup = null"
          >
            <v-list-item-title>View All</v-list-item-title>
            <v-list-item-subtitle>
              <small>{{ store.actions?.length ?? 0 }} actions</small>
            </v-list-item-subtitle>
            <template #append>
              <Icon icon="mdi:chevron-right" class="text-grey" />
            </template>
          </v-list-item>
          <v-list-item
            v-for="group in groupNames"
            :key="group"
            active-color="primary"
            :active="selectedActionsGroup === group"
            @click="selectedActionsGroup = group"
          >
            <v-list-item-title :class="{ 'text-grey-lighten-2': selectedActionsGroup !== group }">{{ group || 'None' }}</v-list-item-title>
            <v-list-item-subtitle>
              <small>{{ actionsGroupMap.get(group).length }} action{{ actionsGroupMap.get(group).length !== 1 ? 's' : '' }}</small>
            </v-list-item-subtitle>
            <template #append>
              <Icon icon="mdi:chevron-right" class="text-grey" />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>

  <v-card>
    <v-card-text class="pa-0">
      <v-list v-if="selectedActionsGroup !== null" nav density="compact">
        <v-list-item
          v-for="action, idx in actionsGroupMap.get(selectedActionsGroup)"
          :key="action.id"
        >
          <v-list-item-title>{{ action.name }}</v-list-item-title>
          <v-list-item-subtitle>
            <small>{{ action.subaction_count }} sub-action{{ action.subaction_count !== 1 ? 's' : '' }}</small>
            <small class="mx-1">•</small>
            <small>{{ action.id }}</small>
          </v-list-item-subtitle>
          <template #append>
            <v-btn
              size="small"
              variant="tonal"
              color="primary"
              :disabled="!store.isConnected || !action.enabled"
              @click="store.client?.doAction(action.id)"
            >
              <span class="mr-1">Execute</span>
              <Icon icon="mdi:play" />
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-list v-else nav subheader density="compact">
        <template v-for="groupName in groupNames">
          <v-divider v-if="groupName !== groupNames[0]" />
          <v-list-subheader>{{ groupName || 'None' }}</v-list-subheader>
          <v-list-item
            v-for="action in actionsGroupMap.get(groupName)"
            :key="groupName"
          >
            <v-list-item-title>{{ action.name }}</v-list-item-title>
            <v-list-item-subtitle>
              <small>{{ action.subaction_count }} sub-action{{ action.subaction_count !== 1 ? 's' : '' }}</small>
              <small class="mx-1">•</small>
              <small>{{ action.id }}</small>
            </v-list-item-subtitle>
            <template #append>
              <v-btn
                size="small"
                variant="tonal"
                color="primary"
                :disabled="!store.isConnected || !action.enabled"
                @click="store.client?.doAction(action.id)"
              >
                <span class="mr-1">Execute</span>
                <Icon icon="mdi:play" />
              </v-btn>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>