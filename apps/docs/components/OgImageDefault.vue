<script setup lang="ts">
// inherited attrs can mess up the satori parser
defineOptions({
  inheritAttrs: false,
});

type Props = {
  path: string;
  title?: string;
  description?: string;
  icon?: string;
  siteName?: string;
  siteLogo?: string;
  categoryTitle?: string;
  categoryIcon?: string;
};
withDefaults(defineProps<Props>(), {
  title: 'Streamer.bot Client',
  description: 'Typescript client for interacting with the Streamer.bot WebSocket API',
  icon: undefined,
  siteName: 'Streamer.bot Client',
  siteLogo: '/logo-dark.svg',
  categoryTitle: 'Documentation',
  categoryIcon: 'mdi:book-open-page-variant-outline',
});
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between items-start bg-[#020420] p-20 pt-32 pb-16">
    <div
      style="position: absolute; width: 1156px; height: 1000px; left: -215px; background: radial-gradient(50% 50% at 50% 50%, #00c3ff 0%, rgba(2, 4, 32, 0) 100%); filter: blur(180.5px); opacity: 0.5;"
    />
    <div>
      <p v-if="categoryTitle" class="font-bold text-2xl text-sky-400 uppercase">
        {{ categoryTitle }}
      </p>
      <h1 class="text-7xl mt-4 mb-4 text-white">
        {{ title }}
      </h1>
      <p class="text-4xl text-neutral-300 leading-tight pr-10">
        {{ description }}
      </p>
    </div>
    <LogoText class="h-[60px] w-[320px] text-white" />
  </div>
</template>