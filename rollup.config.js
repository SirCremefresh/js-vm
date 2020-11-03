import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

const globalPlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
];

const terserPlugin = terser({
  ecma: 2020,
  compress: true,
  module: true,
  mangle: true
});

const projects = [
  {
    projectName: 'sample-lexer-program', copyDirs: [
      { src: `src/app/sample-lexer-program/public/*`, dest: `dist/sample-lexer-program/` },
      { src: `node_modules/codemirror/lib/*`, dest: `dist/sample-lexer-program/` }
    ]
  },
  { projectName: 'sample-vm-program' }
].map(({ projectName, copyDirs }) => ({
  input: `dist/tsc/app/${projectName}/index.js`,
  output: [
    {
      file: `dist/${projectName}/index.pretty.js`,
      name: 'create_single_file',
      format: 'es'
    },
    {
      file: `dist/${projectName}/index.js`,
      format: 'es',
      name: 'optimize',
      plugins: [
        terserPlugin
      ]
    }
  ],
  plugins: [
    ...globalPlugins,
    ...(copyDirs ? [
      copy({
        targets: copyDirs
      })
    ] : [])
  ]
}));

export default [...projects];
