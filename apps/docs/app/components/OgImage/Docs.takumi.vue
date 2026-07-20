<script setup lang="ts">
// inherited attrs can mess up the satori parser
defineOptions({
  inheritAttrs: false,
});

const {
  title,
  description = '',
  icon,
  headline,
} = defineProps<{
  title: string;
  description?: string;
  icon?: string;
  headline?: string;
}>();
</script>

<template>
  <div
    class="size-full grid grid-cols-[40px_1fr_40px] grid-rows-[40px_1fr_40px] font-logo bg-neutral-950"
    :style="{
      backgroundImage:
        'linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }"
  >
    <div
      class="absolute opacity-50 size-full p-[40%] left-3/5 top-1/2 rounded-full"
      :class="[
        'bg-radial-[at_50%_5%] from-sky-900/30 via-blue-700/30 to-indigo-900/10 to-100%',
        'blur-3xl',
      ]"
    />

    <div class="row-start-2 col-start-2 p-8">
      <div class="absolute top-0 right-0 flex items-center text-4xl font-logo">
        <img src="https://streamer.bot/logo-transparent.svg" class="h-[1em] w-auto mb-1 mr-2" />
        <span class="text-toned font-normal tracking-tight">
          Streamer.bot
          <small class="text-[0.9em] text-white font-semibold">&nbsp;Client</small>
        </span>
      </div>
      <div class="size-full flex flex-nowrap items-end">
        <div class="w-full flex flex-col gap-3 mt-auto overflow-hidden">
          <div
            v-if="headline"
            class="text-2xl text-primary font-medium uppercase tracking-wide font-mono"
          >
            {{ headline }}
          </div>
          <div
            class="text-6xl text-white font-medium tracking-tight leading-tight whitespace-nowrap text-ellipsis"
          >
            {{ title }}
          </div>
          <div
            v-if="description"
            class="w-full max-w-[85%] text-4xl text-toned leading-none tracking-tight font-normal"
          >
            {{ description }}
          </div>
        </div>
        <div v-if="icon" class="absolute bottom-0 right-0">
          <UIcon :name="icon" mode="svg" class="size-30 text-primary-100 opacity-50" />
        </div>
      </div>
    </div>

    <div
      class="row-start-1 col-start-1 col-span-full border-b-2 border-dashed border-primary-100/20"
    ></div>
    <div
      class="row-start-3 col-start-1 col-span-full border-t-2 border-dashed border-primary-100/20"
    ></div>
    <div
      class="row-start-1 col-start-1 row-span-full border-r-2 border-dashed border-primary-100/20"
    ></div>
    <div
      class="row-start-1 col-start-3 row-span-full border-l-2 border-dashed border-primary-100/20"
    ></div>
  </div>
</template>
