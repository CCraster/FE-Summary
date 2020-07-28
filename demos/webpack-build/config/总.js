'use strict';

const path = require('path');
const fs = require('fs');
const ROOT_PATH = path.resolve(__dirname, '../');
const resolvePath = relativePath => path.resolve(ROOT_PATH, relativePath);

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const TerserPlugin = require('terser-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');

const isBuildAnalyze = process.env.BUILD_ANALYZE === 'true'; // 包分析模式下的build
const isTimeAnalyze = process.env.TIME_ANALYZE === 'true'; // 打包时间分析模式下的build
const plugins = [
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin({
    inject: true,
    template: resolvePath('public/index.html'),
    favicon: resolvePath('public/favicon.ico'),
  }),
  // new AutoDllPlugin({
  //   inject: true,
  //   filename: '[name].dll.js',
  //   context: ROOT_PATH,
  //   entry: {
  //     elementUI: ['element-ui'],
  //   },
  // }),
];
isBuildAnalyze &&
  plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 8081 }));

const webpackConfig = {
  // mode: 'production',
  mode: 'development',
  entry: resolvePath('src/index.js'),
  output: {
    path: resolvePath('dist'),
  },
  resolve: {
    alias: {
      '@': resolvePath('src'),
    },
    extensions: ['.js', '.vue', '.json'],
    // modules: [resolvePath('node_modules'), resolvePath('src/utils')],
  },
  module: {
    // noParse: /(vue|vue-router|element-ui)/,
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // loader: 'babel-loader?cacheDirectory=true',
        // exclude: resolvePath('node_modules'),
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins,
  // stats: 'errors-only',
  optimization: {
    // minimize: true,
    // minimizer: [
    //   new TerserPlugin({
    //     terserOptions: {
    //       compress: {
    //         warnings: false,
    //         drop_console: true,
    //         drop_debugger: true,
    //         pure_funcs: ['console.log'],
    //       },
    //     },
    //   }),
    // ],
    /**************** splitChunks ****************/
    // splitChunks: {
    //   // maxSize: 300 * 1024,
    //   chunks: 'all',
    //   // maxInitialRequests: 4,
    //   cacheGroups: {
    //     extractVendor: {
    //       test: /[\\/]node_modules[\\/]element-ui[\\/]/,
    //       name(module) {
    //         const match = module.context.match(
    //           /[\\/]node_modules[\\/](.*?)([\\/]|$)/
    //         );
    //         const packageName = (match && match[1]) || 'no-match';
    //         return `vendor-${packageName.replace('@', '')}`;
    //       },
    //       priority: -9,
    //       enforce: true, // 强制绕开maxInitialRequests
    //     },
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendor-common',
    //       priority: -10,
    //       enforce: true,
    //     },
    //   },
    // },
  },
  // externals: {
  //   vue: 'Vue',
  //   'element-ui': 'ELEMENT',
  // },
  devServer: {
    contentBase: resolvePath('dist'),
    open: false,
    compress: true,
    port: 10000,
    // quiet: true,
  },
};

module.exports =
  isBuildAnalyze || isTimeAnalyze ? smp.wrap(webpackConfig) : webpackConfig;
