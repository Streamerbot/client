<script setup lang="ts">
const links = [
  {
    text: 'Streamer.bot',
    href: 'https://streamer.bot',
    icon: 'IconStreamerbot',
  },
  {
    text: 'Discord',
    href: 'https://discord.streamer.bot',
    icon: 'i-mdi-discord',
  },
  {
    text: 'Twitter',
    href: 'https://twitter.com/streamerdotbot',
    icon: 'i-mdi-twitter',
  },
  {
    text: 'Twitch',
    href: 'https://twitch.tv/team/streamerdotbot',
    icon: 'i-mdi-twitch',
  },
  {
    text:' YouTube',
    href: 'https://youtube.com/@streamerdotbot',
    icon: 'i-mdi-youtube',
  },
  {
    text: 'Instagram',
    href: 'https://www.instagram.com/streamerdotbot',
    icon: 'i-mdi-instagram',
  },
  {
    text: 'Reddit',
    href: 'https://reddit.com/r/streamerbot',
    icon: 'i-mdi-reddit',
  },
    {
    text: 'GitHub',
    href: 'https://github.com/Streamerbot/docs',
    icon: 'i-mdi-github',
  },
];
</script>

<template>
  <div class="w-full h-px bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-900 px-4">
      <IconStreamerbot class="w-5 h-5" />
    </div>
  </div>

  <UFooter :ui="{ bottom: { container: 'lg:py-4' } }">
    <template #left>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Made by
        <NuxtLink to="https://streamer.bot" aria-label="Streamer.bot" class="inline-block">
          <IconStreamerbot class="text-gray-900 dark:text-white h-4 w-auto inline" />
          Streamer.bot
        </NuxtLink>
      </div>
    </template>

    <template #center />

    <template #right>
      <UButton
        v-for="link in links"
        :key="link.href"
        :title="link.text"
        :aria-label="link.text"
        :icon="link.icon"
        :to="link.href"
        target="_blank"
        rel="noopener"
        v-bind="($ui.button.secondary as any)"
      />
    </template>
  </UFooter>
</template>