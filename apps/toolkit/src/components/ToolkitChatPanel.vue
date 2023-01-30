<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useStreamerbot } from '../composables/Streamerbot';

const { logs } = useStreamerbot();


const chatHistory = computed(() => {
  return logs.value
    .filter(log => log.event.type === 'ChatMessage')
});

const scrollerElement = ref<any>();
watch(() => chatHistory.value.length, () => scrollToBottom());
onMounted(() => scrollToBottom())

async function scrollToBottom() {
  if (!scrollerElement.value?.$el) return;

  console.log(chatHistory.value.length)

  await nextTick();

  scrollerElement.value.$el.dispatchEvent(new Event('scroll', { 'bubbles': true }));
  scrollerElement.value.$el.scrollTop = scrollerElement.value.$el.scrollHeight - 48;
  scrollerElement.value.$el.scrollTop = scrollerElement.value.$el.scrollHeight;
}

function clearChat() {
  logs.value = logs.value.filter(log => log.event.type !== 'ChatMessage');
}

function formatTime(timeStamp: string) {
  return new Date(timeStamp).toLocaleTimeString();
}
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center font-weight-light">
      <span>Chat</span>
      <v-spacer />
      <v-btn color="primary" size="small" variant="tonal" @click="clearChat">
        Clear
        <v-icon class="ml-1">mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider class="mx-2" />
    <v-card-text class="pa-0">
      <v-virtual-scroll
        ref="scrollerElement"
        :items="chatHistory"
        item-key="id"
        :height="48 * 10"
        :item-height="48"
        :visible-items="50"
      >
        <template #default="{ item }">
          <v-list-item height="48" style="max-height: 48px">
            <template #prepend>
              <div class="d-flex py-1" style="height: 48px;">
                <div class="text-grey text-right mr-2" style="width: 10ch;">
                  <span>{{ formatTime(item.timeStamp) }}</span>
                </div>
                <div class="mr-1" style="padding-top: 2px;">
                  <span v-for="badge in item.data.message.badges" :key="badge.name" style="margin: 0 2px">
                    <img :src="badge.imageUrl" height="12" width="12" />
                  </span>
                </div>
                <div class="mr-1">
                  <span
                    class="font-weight-bold"
                    :style="{
                      color: item.data.message.color ?? (item.data.message.role >= 3 ? 'red' : 'grey'),
                      filter: 'brightness(150%)'
                    }"
                  >
                    {{ item.data.message.displayName }}:
                  </span>
                </div>
              </div>
            </template>

            <template #default>
              <div class="py-1" style="height: 48px">
                <span class="text-grey-lighten-2">{{ item.data.message.message }}</span>
              </div>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>