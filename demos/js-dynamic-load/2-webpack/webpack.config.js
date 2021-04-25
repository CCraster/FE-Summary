const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'none',
  entry: './index.js',
  output: {
    filename: 'main.js',
    // chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, './dist-non'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
    }),
    new MiniCssExtractPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9999,
    hot: true,
  },
};
