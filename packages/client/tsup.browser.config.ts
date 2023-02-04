import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    "streamerbot-client": 'src/browser.ts',
  },
  outExtension: () => ({ js : '.js' }),
  format: ['iife'],
  globalName: 'Streamerbot',
  minify: true,
  shims: true,
  platform: 'browser',
});
