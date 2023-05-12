<script setup lang="ts">
</script>

<template>
  <div class="ellipsis"></div>
</template>

<style scoped>
.ellipsis {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: #0c0c0d;
  background-image: radial-gradient(ellipse at 0% 0%, rgb(26, 214, 255, 0.01), rgb(26, 214, 255, 0.001) 60%),
    radial-gradient(ellipse at 20% 10%, rgb(26, 214, 255, 0.01), rgb(26, 214, 255, 0.001) 40%),
    radial-gradient(ellipse at 70% 40%, rgb(26, 214, 255, 0.01), rgb(26, 214, 255, 0.001) 60%),
    radial-gradient(ellipse at 80% 20%, rgb(26, 214, 255, 0.05), rgb(26, 214, 255, 0.001) 40%),
    radial-gradient(ellipse at 100% 0%, rgb(26, 214, 255, 0.01), rgb(26, 214, 255, 0.001) 70%);
}
</style>
