import {terser} from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

const globalPlugins =  [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  })
];

const terserPlugin = terser({
  ecma: 2020,
  compress: true,
  module: true,
  mangle: true
})

const projects = [
  'sample-lexer-program',
  'sample-vm-program'
].map(projectName => ({
  input: `dist/tsc/app/${projectName}/index.js`,
  output: [
    {
      file: `dist/${projectName}.pretty.js`,
      name: 'create_single_file',
      format: 'es',
    },
    {
      file: `dist/${projectName}.js`,
      format: 'es',
      name: 'optimize',
      plugins: [
        terserPlugin
      ]
    }
  ],
  plugins: globalPlugins
}))

export default [...projects];
