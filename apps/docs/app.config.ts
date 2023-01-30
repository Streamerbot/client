export default defineAppConfig({
  docus: {
    title: 'Streamer.bot Client Documentation',
    description:
      'Typescript client for interacting with the Streamer.bot WebSocket API',
    url: 'https://streamerbot.github.io/client',
    image: 'https://streamerbot.github.io/client/og-image.png',
    socials: {
      web: {
        label: 'Streamer.bot',
        icon: 'mdi:launch',
        href: 'https://streamer.bot',
      },
      twitter: 'streamerdotbot',
      github: 'streamerbot/client',
    },
    aside: {
      level: 0,
      exclude: [],
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
    },
  },
});
