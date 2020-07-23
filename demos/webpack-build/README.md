# webpack 打包优化小小分享

[TOC]

## 1. 分析工具

### 1.1 打包时间分析

[speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)

### 1.2 分包分析

1. [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) `✅`
2. [官方可视化分析工具 Webapck Analyse](http://webpack.github.io/analyse/)
3. [Webpack Visualizer](http://chrisbateman.github.io/webpack-visualizer/)

```javascript
// 最后配置
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const plugins = [new BundleAnalyzerPlugin({ analyzerPort: 8081 })];
const webpackConfig = smp.wrap({
  plugins,
  // ...
});
```

## 2. 提升打包速度

### 2.1 配置 resolve.modules

> 小项目效果不明显

```javascript
// 针对类似import 'vue'的非绝对非相对引用模块
function resolvePath(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  resolve: {
    modules: [resolvePath('src'), resolvePath('node_modules')],
  },
  // ...
};
```

### 2.2 设置 test & include & exclude

```javascript
module.export = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  // ...
};
```

### 2.3 设置 babel 的 cacheDirectory 为 true

```javascript
module.export = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        exclude: /node_modules/,
      },
    ],
  },
  // ...
};
```

### 2.4 设置 noParse

```javascript
module.export = {
  module: {
    noParse: /(vue|vue-router|element-ui)/,
  },
  // ...
};
```

### 2.5 提取不常变动的 module

见 4. 拆包

## 3. 减少包的体积

### 3.1 生产环境去除 console

> webpack 中的配置

```javascript
const TerserPlugin = require('terser-webpack-plugin');

new TerserPlugin({
  terserOptions: {
    compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
    },
  },
}),
```

> vue-cli 中的配置

```javascript
/**
 * 如果提示TypeError: config.optimization.minimizer(...).tap is not a function，把@vue/cli-service升到4.0版本以上就行或者在configureWebpack里配置terser。
 */

// @vue/cli-service 4.0+
module.exports = {
  chainWebpack: config => {
    config.optimization.minimizer('terser').tap(args => {
      args[0].terserOptions.compress = {
        ...args[0].terserOptions.compress,
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      };
      return args;
    });
  },
};
// @vue/cli-service 3.0+，4.0不用判断production环境
if (isProduction) {
  config.optimization.minimizer[0].options.terserOptions.compress = {
    ...config.optimization.minimizer[0].options.terserOptions.compress,
    warnings: false,
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ['console.log'],
  };
}
```

### 3.2 尽量使用模块化引入

```javascript
import { Button } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 改为
import Button from 'element-ui/lib/button';
import 'element-ui/lib/theme-chalk/button.css';
```

### 3.3 按需异步加载模块

```javascript
import Foo from './Foo.vue';
// 改写为
const Foo = () => import('./Foo.vue');
```

### 3.4 提取不常变动的 module

见 4. 拆包

## 4. code split

### 4.1 DllPlugin 和 DllReferencePlugin

> `比较麻烦`

DllPlugin 和 DllReferencePlugin 将特定的第三方 NPM 包模块提前构建，然后通过页面引入，使得 vendor 文件可以大幅度减小，提高了构件速度。[使用介绍](https://juejin.im/post/5d8aac8fe51d4578477a6699)

### 4.2 AutoDllPlugin

```javascript
const path = require('path');
const AutoDllPlugin = require('autodll-webpack-plugin'); // 第 1 步：引入 DLL 自动链接库插件

module.exports = {
  plugins: [
    // 第 2 步：配置要打包为 dll 的文件
    new AutoDllPlugin({
      inject: true, // 设为 true 就把 DLL bundles 插到 index.html 里
      filename: '[name].dll.js',
      // context: path.resolve(__dirname, "./"), // AutoDllPlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
      entry: {
        elementUI: ['element-ui'],
      },
    }),
  ],
  // ...
};
```

### 4.3 使用 CDN 加载

> [参考 CDN 引入 element-ui](https://panjiachen.github.io/vue-element-admin-site/zh/guide/advanced/cdn.html#%E6%88%91%E4%B8%AA%E4%BA%BA%E6%9A%82%E6%97%B6%E4%B8%8D%E4%BD%BF%E7%94%A8cdn%E5%BC%95%E5%85%A5%E7%AC%AC%E4%B8%89%E6%96%B9%E4%BE%9D%E8%B5%96%E7%9A%84%E5%8E%9F%E5%9B%A0%EF%BC%9A)

```javascript
/**
 * 以下是vue-cli3中可以的配置
 * 因为element要依赖vue，cdn引用element，vue也必须cdn引用
 */
// index.html
<html lang="en">
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/element-ui@2.13.2/lib/theme-chalk/index.css"
    />
    <script src="https://unpkg.com/vue@2.6.11/dist/vue.js"></script>
    <script src="https://unpkg.com/element-ui@2.13.2/lib/index.js"></script>
  </body>
</html>

// main.js
// 注意，需要注释掉代码里所有的import Vue from "vue"，不然会报错
// import Vue from "vue"
// import ElementUI from "element-ui"
// import "element-ui/lib/theme-chalk/index.css"
Vue.use(ELEMENT)

// vue.config.js
module.exports = {
  configureWebpack:{
    externals: {
      'vue': 'Vue',
      'element-ui': 'ELEMENT'
    }
  }
}
```

`关于效果：打包时间缩减明显，资源的加载速度依赖于CDN`

### 4.4 webpack 提供的 splitChunks

```javascript
// webpack4默认splitChunks配置
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // 指定哪些类型的chunk参与拆分，可选：all-所有模块, async-异步加载模块, initial-初始化能获取的模块
      minSize: 30000, // 提取出的chunk的【最小】大小，单位字节
      maxSize: 0, // 提取出的chunk的【最大】大小，单位字节
      minChunks: 1, // 参与拆分的模块，被引用的最小次数
      maxAsyncRequests: 5, // 异步模块内部并行最大请求数，模块自己算一个名额
      maxInitialRequests: 3, // 初始化模块内部并行最大请求数，模块自己算一个名额
      automaticNameDelimiter: '~', // 通用chunk命名连接符
      name: true, // 通用命名规则
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2, // 覆盖之前通用的设置
          priority: -20, // 优先级
          reuseExistingChunk: true, // 是否使用已有的chunk，true表示如果当前的chunk包含的模块已经被抽取出去了，将不会重新生成新的
        },
      },
    },
  },
};
```

## 5. 参考资料

1. [webpack 中文网](https://www.webpackjs.com/)
2. [webpack 官网](https://webpack.js.org/)
3. [Webpack 打包优化之速度篇](https://cloud.tencent.com/developer/article/1075299)
4. [Webpack 打包优化之体积篇](https://cloud.tencent.com/developer/article/1075308)
5. [重构之路：webpack 打包体积优化（超详细）](https://juejin.im/post/5c6fae50e51d45196636bf07)
6. [webpack 打包优化的四种方法](https://www.jianshu.com/p/481e7214a134)
7. [五种可视化方案分析 webpack 打包性能瓶颈](https://juejin.im/post/5e39570bf265da573c0c6679)
8. [探索 webpack 构建速度提升方法和优化策略](https://juejin.im/post/5e6502fa51882549052f531b)
9. [webpack 优化之玩转代码分割和公共代码提取](https://segmentfault.com/a/1190000021074403)
10. [搞懂 webpack 热更新原理](https://juejin.im/post/5d6d0ee5f265da03f66ddba9)
11. [轻松理解 webpack 热更新原理](https://juejin.im/post/5de0cfe46fb9a071665d3df0)
12. [手摸手，带你用合理的姿势使用 webpack4（上）](https://juejin.im/post/5b56909a518825195f499806)
13. [手摸手，带你用合理的姿势使用 webpack4（下）](https://panjiachen.github.io/awesome-bookmarks/blog/webpack/webpack4-b.html)
14. [记一次 vue-cli 3.0 build 包太大导致首屏过长的解决方案](https://juejin.im/post/5d9ff02df265da5baf4104d9)
15. [使用 happypack 提升 Webpack 项目构建速度](https://juejin.im/post/5c6e0c3a518825621f2a6f45)
