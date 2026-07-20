import { defineConfig } from 'tsdown';
import Vue from 'unplugin-vue/rolldown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    components: 'src/components/index.ts',
  },
  format: {
    esm: {
      target: ['es2024'],
    },
    cjs: {
      target: ['node20'],
    },
    iife: {
      target: ['es2020'],
      globalName: 'Streamerbot',
      entry: {
        'streamerbot-vue': 'src/browser.ts',
      },
      minify: true,
    },
  },
  external: ['vue'],
  platform: 'neutral',
  plugins: [Vue({ isProduction: true })],
  dts: { vue: true },
  outputOptions(outputOptions, format) {
    if (format === 'iife') {
      outputOptions.entryFileNames = 'streamerbot-vue.js';
      outputOptions.minify = true;
    }
    return outputOptions;
  },
});
