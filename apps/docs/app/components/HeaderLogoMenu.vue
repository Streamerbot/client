<script setup lang="ts">
const links: Array<{
  title: string;
  href: string;
  icon: string;
  description: string;
}> = [
  {
    title: 'Streamer.bot',
    href: 'https://streamer.bot',
    description: 'Streamer.bot Website',
    icon: 'IconStreamerbot',
  },
  {
    title: 'Streamer.bot Documentation',
    href: 'https://docs.streamer.bot',
    description: 'Official documentation for Streamer.bot',
    icon: 'IconStreamerbot',
  },
    {
    title: 'Speaker.bot',
    href: '/',
    description: 'Speaker.bot Documentation',
    icon: 'IconSpeakerbot',
  },
  {
    title: 'Extensions',
    href: 'https://extensions.streamer.bot',
    description: 'Community-made features, ready to import!',
    icon: 'IconStreamerbotExtensions',
  },
  {
    title: 'Stream Deck Plugin',
    href: 'https://streamdeck.streamer.bot',
    description: 'Official plugin for Elgato Stream Deck',
    icon: 'simple-icons:elgato',
  },
  {
    title: 'Streamer.bot Client',
    href: 'https://streamerbot.github.io/client/',
    description: 'Official WebSocket Client for Streamer.bot',
    icon: 'IconStreamerbot',
  },
  {
    title: 'Discord',
    href: 'https://discord.streamer.bot',
    description: 'Official Discord server for Streamer.bot',
    icon: 'mdi:discord',
  },
  {
    title: 'Ideas & Suggestions',
    href: 'https://ideas.streamer.bot',
    description: 'Suggest new features and vote on existing ideas',
    icon: 'mdi:lightbulb'
  }
];
</script>

<template>
  <UPopover class="relative">
    <template #default="{ open }">
      <UButton
        :color="null"
        size="sm"
        class="pl-0"
      >
        <div class="flex items-center">
          <img src="https://streamer.bot/logo-transparent.svg" width="26">
          <span class="font-light text-xl text-neutral-900 dark:text-neutral-300 ml-1">
            Streamer.bot
            <span><small class="font-normal text-neutral-400 dark:text-neutral-100 tracking-tight">Client</small></span>
          </span>
        </div>
        <Icon
          :class="open ? '' : 'text-opacity-70'"
          class="ml-2 h-5 w-5 text-neutral-600 dark:text-neutral-300 transition duration-150 ease-in-out group-hover:text-opacity-80"
          name="mdi:chevron-down"
          aria-hidden="true"
        />
      </UButton>
    </template>
    <template #panel="{ close }">
      <div
        class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div class="relative grid gap-8 bg-neutral-900 p-7 lg:grid-cols-2">
          <NuxtLink
            v-for="item in links"
            :key="item.title"
            :href="item.href"
            class="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-800 focus:outline-none focus-visible:ring focus-visible:ring-cyan-600 focus-visible:ring-opacity-50"
            @click.stop="close()"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center text-white bg-neutral-800 rounded-xl sm:h-12 sm:w-12"
            >
              <Icon :name="item.icon" class="h-8 w-8" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-neutral-200">
                {{ item.title }}
              </p>
              <p class="text-sm font-normal text-neutral-400">
                {{ item.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
  </UPopover>
</template>