import {terser} from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

export default {
  input: 'dist/tsc/index.js',
  output: [
    {
      file: 'dist/index.pretty.js',
      format: 'es',
    },
    {
      file: 'dist/index.js',
      format: 'es',
      name: 'version',
      plugins: [
        terser({
          ecma: 2020,
          compress: true,
          module: true,
          mangle: true
        })
      ]
    }
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    })
  ]
};
