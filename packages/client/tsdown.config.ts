import { defineConfig } from 'tsdown';

export default defineConfig(() => ({
  entry: {
    index: 'src/index.ts',
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
        'streamerbot-client': 'src/browser.ts',
      },
      minify: true,
    },
  },
  platform: 'neutral',
  dts: true,
  outputOptions(outputOptions, format) {
    if (format === 'iife') {
      outputOptions.entryFileNames = 'streamerbot-client.js';
      outputOptions.minify = true;
    }
    return outputOptions;
  },
  deps: {
    alwaysBundle: ['uncrypto'],
  },
}));
