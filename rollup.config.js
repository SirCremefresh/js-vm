import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

const globalPlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
];

const specificProject = process.env.SPECIFIC_PROJECT;

const terserPlugin = terser({
  ecma: 2020,
  compress: true,
  module: true,
  mangle: true
});

const projects = [
  { projectName: 'web-ide', copyPublic: true },
  { projectName: 'sample-vm-program', copyPublic: false },
  { projectName: 'sample-code-generator', copyPublic: false }
]
  .filter(project => specificProject === undefined || project.projectName === specificProject)
  .map(({ projectName, copyPublic }) => ({
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
      ...(copyPublic ? [
        copy({
          targets: [
            { src: `src/app/${projectName}/public/*`, dest: `dist/${projectName}/` }
          ]
        })
      ] : [])
    ]
  }));

export default [...projects];
