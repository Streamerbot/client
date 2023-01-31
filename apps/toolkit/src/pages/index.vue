<script setup lang="ts">

</script>

<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title class="font-weight-light">Streamer.bot Toolkit</v-card-title>
          <v-divider class="mx-3" />
          <v-card-text>
            <h4 class="mb-3">Welcome!</h4>
            <p class="mb-3">This application serves as a testing ground for the <code>@streamerbot/client</code> and <code>@streamerbot/vue</code> packages (available on npm).</p>
            <p class="mb-3">While most modules are currently in varying experimental states, the <RouterLink to="/actions">actions</RouterLink> and <RouterLink to="/logs">logs</RouterLink> modules may prove useful to those building out Streamer.bot interactions.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>