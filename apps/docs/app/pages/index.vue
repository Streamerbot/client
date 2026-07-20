<script setup lang="ts">
const links = [
  {
    label: 'Get Started',
    to: '/get-started/installation',
    icon: 'i-heroicons-rocket-launch',
    size: 'lg',
    variant: 'subtle',
  },
  {
    label: 'Open on GitHub →',
    to: 'https://github.com/streamerbot/client',
    icon: 'i-mdi-github',
    target: '_blank',
    color: 'neutral',
    variant: 'ghost',
  },
];

const features = [
  {
    title: 'Execute Actions',
    description: 'Trigger immediate action executions on your Streamer.bot instance',
    icon: 'i-mdi-lightning-bolt',
  },
  {
    title: 'Subscribe to Events',
    description:
      'Easily subscribe to real-time event data from all connected services in Streamer.bot',
    icon: 'i-mdi-creation',
  },
  {
    title: 'TypeScript Architecture',
    description: 'Harness the full power of type-safety and IDE autocompletion',
    icon: 'i-vscode-icons-file-type-typescript',
  },
];

const code = `
::code-group
\`\`\` [pnpm]
pnpm install @streamerbot/client
\`\`\`
\`\`\` [npm]
npm install @streamerbot/client
\`\`\`
\`\`\` [yarn]
yarn add @streamerbot/client
\`\`\`
::
`;
</script>

<template>
  <UPageHero
    orientation="horizontal"
    title="Streamer.bot Client"
    description="Official client for interacting with the Streamer.bot WebSocket API"
    :links
  >
    <MDC :value="code" />
  </UPageHero>

  <UPageSection
    title="Real-time interaction with ease"
    description="Build your own browser sources, overlays, or even full-blown NodeJS applications taking advantage of real-time data from Streamer.bot "
    :features
  />
</template>

<style scoped>
.gradient {
  position: absolute;
  left: 0;
  right: 0;
  top: 25vh;
  width: 100%;
  height: 30vh;
  background: radial-gradient(50% 50% at 50% 50%, rgb(1, 126, 199) 0%, rgba(0, 220, 130, 0) 100%);
  filter: blur(150px);
  border-radius: 50%;
  opacity: 0.5;
  z-index: -1;
}
</style>
