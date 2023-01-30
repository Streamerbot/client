import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: {
    index: 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  minify: !options.watch,
  dts: true
}));
