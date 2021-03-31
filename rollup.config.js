import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
    input: 'src/main.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'AccomplishedBarnacle',
      globals :{
          sitka:'sitka',
          'choicest-barnacle':'choicest-barnacle'
      }
    },
    plugins: [
        typescript({
          typescript: require('typescript'),
        }),
        nodePolyfills()
    ],
    external: [ 'sitka','choicest-barnacle' ]
  };