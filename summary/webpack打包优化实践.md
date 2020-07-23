# 目录

[TOC]

## 0）性能分析工具

1. 打包时间分析插件：[speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)
2. 包体积分析插件：[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

```javascript
// 以vue3配置为例
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const plugins = [new BundleAnalyzerPlugin({ analyzerPort: 8081 })];
module.exports = {
  configureWebpack: smp.wrap({
    plugins,
  }),
  // ...
};
```

## 1）提升打包速度

- 配置 resolve.modules、resolve.alias `小项目效果不明显`

```javascript
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [resolve('src'), resolve('node_modules')],
    alias: {
      vue$: 'vue/dist/vue.common.js',
      src: resolve('src'),
      assets: resolve('src/assets'),
      components: resolve('src/components'),
    },
  },
  // ...
};
```

- 设置 test & include & exclude `小项目效果不明显`

```javascript
module.export = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
        exclude: /node_modules/,
      },
    ],
  },
  // ...
};
```

//http://npm.anvaka.com/
http://npm.broofa.com/

- 使用多进程、多实例构建 `小项目效果不明显`

1. [thread-loader](https://github.com/webpack-contrib/thread-loader)(官方推荐) `vue自带启用`

原理：每次 webpack 解析一个模块，thread-loader 会将它及它的依赖分配给 worker 线程中

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3,
            },
          },
          'babel-loader',
        ],
      },
    ],
  },
  // ...
};
```

2. [parallel-webpack](https://github.com/trivago/parallel-webpack) `比较适合多页面应用的打包`

原理：parallel-webpack 允许并行运行多个 Webpack 构建，将工作分散到各个处理器上，从而加快构建速度。

3. [Happypack](https://github.com/amireh/happypack) `对file-loader、url-loader支持的不友好`

原理：Happypack 将文件解析任务分解成多个子进程并发执行，子进程处理完任务后再将结果发送给主进程，因此可以大大提升 Webpack 的项目构建速度。[使用 happypack 提升 Webpack 项目构建速度](https://juejin.im/post/5c6e0c3a518825621f2a6f45)

- 设置 babel 的 cacheDirectory 为 true

```javascript
module.export = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test')],
      },
    ],
  },
  // ...
};
```

- code split
  见第 3 点

## 2）减少包的体积

- 生产环境，压缩混淆并移除 console.log

> webpack4 中的配置

```javascript
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
  chainWebpack: (config) => {
    config.optimization.minimizer('terser').tap((args) => {
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

- 尽量使用模块化引入

```javascript
import { debounce } from 'lodash';
import { throttle } from 'lodash';
// 改成为
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

- 按需异步加载模块

```javascript
import Foo from './Foo.vue';
// 改写为
const Foo = () => import('./Foo.vue');
```

- Webpack3 新功能: Scope Hoisting

```javascript
module.exports = {
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
};
```

- code split
  见第 3)点

## 3）如何做 code split

- DllPlugin 和 DllReferencePlugin `比较麻烦`

  DllPlugin 和 DllReferencePlugin 提供了以大幅度提高构建时间性能的方式拆分软件包的方法。它将特定的第三方 NPM 包模块提前构建，然后通过页面引入，使得 vendor 文件可以大幅度减小，同时也极大的提高了构件速度。[使用介绍](https://juejin.im/post/5d8aac8fe51d4578477a6699)

- AutoDllPlugin

```javascript
const path = require('path');
const AutoDllPlugin = require('autodll-webpack-plugin'); // 第 1 步：引入 DLL 自动链接库插件

module.exports = {
  // ......
  plugins: [
    // 第 2 步：配置要打包为 dll 的文件
    new AutoDllPlugin({
      inject: true, // 设为 true 就把 DLL bundles 插到 index.html 里
      filename: '[name].dll.js',
      // context: path.resolve(__dirname, "./"), // AutoDllPlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
      entry: {
        contentRichEditor: [
          'content-rich-editor',
          'content-rich-editor/build/VideoPanel.js',
        ],
        // editor: ["content-rich-editor"],
        // videoPanel: ["content-rich-editor/build/VideoPanel.js"],
        elementUI: ['element-ui'],
      },
    }),
  ],
};
```

- 使用 CDN 加载 [参考 CDN 引入 element-ui](https://panjiachen.github.io/vue-element-admin-site/zh/guide/advanced/cdn.html#%E6%88%91%E4%B8%AA%E4%BA%BA%E6%9A%82%E6%97%B6%E4%B8%8D%E4%BD%BF%E7%94%A8cdn%E5%BC%95%E5%85%A5%E7%AC%AC%E4%B8%89%E6%96%B9%E4%BE%9D%E8%B5%96%E7%9A%84%E5%8E%9F%E5%9B%A0%EF%BC%9A)

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

`关于效果：打包时间缩减明显，但是引用CDN资源加载时间有点不稳定`

- webpack 提供的[splitChunks](https://webpack.docschina.org/plugins/split-chunks-plugin/)

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

content-create 项目的配置，这个怎么拆的依据项目[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)的情况来

```javascript
splitChunks: {
  // maxSize: 300 * 1024,
  chunks: "all",
  // maxInitialRequests: 4,
  cacheGroups: {
    extractVendor: {
      test: /[\\/]node_modules[\\/]HAS_USE_DLL[\\/]/,
      name(module) {
        const match = module.context.match(
          /[\\/]node_modules[\\/](.*?)([\\/]|$)/
        )
        const packageName = (match && match[1]) || "no-match"
        return `vendor-${packageName.replace("@", "")}`
      },
      priority: -9,
      enforce: true // 强制绕开maxInitialRequests
    },
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: "vendor-common",
      priority: -10,
      enforce: true
    }
  }
}
```

## 参考资料

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
