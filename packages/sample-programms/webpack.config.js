const TerserPlugin = require('terser-webpack-plugin')

module.exports = (config) => {
  return {
    ...config,
    externals: [],
    plugins: [
      ...config.plugins,
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 2020,
        },
      }),
    ],
    devtool: false,
    output: {
      ...config.output,
      filename: 'sdk.umd.js',
      libraryTarget: 'umd',
    },
  };
};
