<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStreamerbotStore } from '../stores/streamerbot.store';

const store = useStreamerbotStore();
const activeItem = ref(0);

const items = computed(() => [
  {
    title: 'Dashboard',
    icon: 'mdi:view-dashboard',
    to: '/',
  },
  {
    title: 'Actions',
    icon: 'mdi:lightning-bolt',
    to: '/actions',
    badge: store.actions?.length ?? 0,
  },
  {
    title: 'Variables',
    icon: 'mdi:application-variable-outline',
    to: '/variables',
    badge: store.variables?.length ?? 0,
  },
  {
    title: 'Logs',
    icon: 'mdi:note-multiple',
    to: '/logs',
    badge: store.logs?.length ?? 0,
  },
  {
    title: 'Settings',
    icon: 'mdi:cog',
    to: '/settings',
  },
]);
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list v-model="activeItem" nav density="compact">
      <v-list-item
        v-for="(item, idx) in items"
        :key="idx"
        :active="$route.path === item.to"
        active-color="primary"
        :to="item.to"
        @click="activeItem = idx"
      >
        <template #prepend>
          <Icon :icon="item.icon" class="mr-3" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>

        <template v-if="item.badge" #append>
          <v-chip label color="primary" size="x-small">{{ item.badge }}</v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>