const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

const isBuildAnalyze = process.env.BUILD_ANALYZE === 'true'; // 包分析模式下的build
const plugins = [];
isBuildAnalyze &&
  plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 8081 }));

const webpackConfig = {
  plugins,
  devtool: 'source-map',
  resolve: {},
};

module.exports = {
  productionSourceMap: true,
  publicPath: '/',
  configureWebpack: isBuildAnalyze ? smp.wrap(webpackConfig) : webpackConfig,
  devServer: {
    port: 10000,
    disableHostCheck: true,
  },
};
