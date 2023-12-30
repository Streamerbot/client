export const useLinks = (page: Ref<any> = null) => {
  const communityLinks = computed(() => [
    page?.value ? {
      icon: 'i-heroicons-pencil-square',
      label: 'Edit this page',
      to: `https://github.com/Streamerbot/client/edit/main/apps/docs/content/${page?.value?._file}`,
      target: '_blank',
    } : undefined,
    {
      icon: 'i-heroicons-chat-bubble-bottom-center-text',
      label: 'Chat on Discord',
      to: 'https://discord.streamer.bot',
      target: '_blank',
    },
    {
      icon: 'i-heroicons-gift',
      label: 'Become a Sponsor',
      to: 'https://patreon.com/nate1280',
      target: '_blank',
    }
  ].filter(Boolean));

  const ecosystemLinks = [
    {
      icon: 'i-heroicons-globe-alt',
      label: 'Streamer.bot',
      to: 'https://streamer.bot',
      target: '_blank',
    },
    {
      icon: 'i-heroicons-globe-alt',
      label: 'Speaker.bot',
      to: 'https://speaker.bot',
      target: '_blank',
    },
  ];

  return {
    communityLinks,
    ecosystemLinks,
  }
}
