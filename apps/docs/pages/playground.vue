<script setup lang="ts">

</script>

<template>
  <UPage>
    <UPageHeader title="Playground" description="Utilize @streamerbot/client to play with Streamer.bot from your web browser!" />

    <UPageBody>
      <ClientOnly>
        <StreamerbotPlayground />
      </ClientOnly>
    </UPageBody>
  </UPage>
</template>