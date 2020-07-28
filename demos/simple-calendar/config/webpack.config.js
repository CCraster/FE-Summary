'use strict';

const path = require('path');
const fs = require('fs');
const ROOT_PATH = path.resolve(__dirname, '../');
const resolvePath = (relativePath) => path.resolve(ROOT_PATH, relativePath);

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: resolvePath('src/index.js'),
  output: {
    path: resolvePath('dist'),
  },
  resolve: {
    alias: {
      '@': resolvePath('src'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: resolvePath('public/index.html'),
          favicon: resolvePath('public/favicon.ico'),
        }
      )
    ),
  ],
  devServer: {
    contentBase: resolvePath('dist'),
    open: false,
    compress: true,
    port: 9000,
  },
};
