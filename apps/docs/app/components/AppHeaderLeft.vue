<script setup lang="ts">
const links: Array<{
  label: string;
  href: string;
  icon: string;
  description: string;
}> = [
  {
    label: 'Streamer.bot',
    href: 'https://streamer.bot',
    description: 'Streamer.bot Website',
    icon: 'IconStreamerbot',
  },
  {
    label: 'Docs',
    href: '/',
    description: 'Streamer.bot Documentation',
    icon: 'IconStreamerbot',
  },
  {
    label: 'Speaker.bot',
    href: 'https://speaker.bot',
    description: 'Supercharged TTS for your live stream!',
    icon: 'IconSpeakerbot',
  },
  {
    label: 'Extensions',
    href: 'https://extensions.streamer.bot',
    description: 'Community-made features, ready to import!',
    icon: 'IconStreamerbotExtensions',
  },
  {
    label: 'Stream Deck Plugin',
    href: 'https://streamdeck.streamer.bot',
    description: 'Official plugin for Elgato Stream Deck',
    icon: 'simple-icons:elgato',
  },
  {
    label: 'Streamer.bot Client',
    href: 'https://streamerbot.github.io/client/',
    description: 'Official WebSocket Client for Streamer.bot',
    icon: 'IconStreamerbot',
  },
  {
    label: 'Discord',
    href: 'https://discord.streamer.bot',
    description: 'Official Discord server for Streamer.bot',
    icon: 'mdi:discord',
  },
  {
    label: 'Ideas & Suggestions',
    href: 'https://ideas.streamer.bot',
    description: 'Suggest new features and vote on existing ideas',
    icon: 'mdi:lightbulb',
  },
];

const items = [
  {
    label: 'Streamer.bot',
    slot: 'main',
    children: links,
  },
];
</script>

<template>
  <UNavigationMenu
    orientation="horizontal"
    :items
    :ui="{
      viewport: 'min-w-[360px] md:min-w-[600px] max-w-screen ml-10 sm:ml-0 translate-x-1/3',
      childList: 'grid grid-cols-1 md:grid-cols-2',
    }"
    class="-ml-3"
  >
    <template #main-leading>
      <img
        src="https://streamer.bot/logo-transparent.svg"
        class="size-6 max-h-[1.8em] mb-1 -mr-1"
      />
    </template>
    <template #main-label="{ item }">
      <span
        class="hidden md:inline font-logo font-light tracking-tighter text-xl text-neutral-900 dark:text-neutral-300"
      >
        Streamer.bot
        <small class="font-semibold text-neutral-400 dark:text-neutral-100 tracking-tight">
          Client
        </small>
      </span>
    </template>
  </UNavigationMenu>
</template>
