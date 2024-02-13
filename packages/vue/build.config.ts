import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: 'compatible',
  rollup: {
    emitCJS: true
  }
})