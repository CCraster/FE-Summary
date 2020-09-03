# 前言

&emsp;项目开发中，总是有些公共的 css 常量和样式的，若只是在 css 文件中用，还可以引用一下，但若是在每个需要用到该变量的组件中都引用，就变得难受且难以维护了。这时候，全局变量就很香了。

# 讲正事

> PS：以下方法呢，在 vue-cli3 中好使

## less 全局变量配置

1. 安装插件

```
npm i style-resources-loader vue-cli-plugin-style-resources-loader -D
```

2. 在 vue.config.js 中进行配置

```javascript
module.exports = {
  // ...
  pluginOptions: {
    // 引入 less 全局变量
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/styles/variables.less')],
    },
  },
};
```

## scss 全局变量配置

```javascript
module.exports = {
  // ...
  css: {
    loaderOptions: {
      // 注意分号不能少，不然报错。。。
      sass: {
        data: `@import '@/styles/variables.scss';`,
      },
    },
  },
};
```

`当然，也可以使用chainwebpack的语法`

```javascript
module.exports = {
  chainWebpack: (config) => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          resources: './path/to/resources.scss',

          // Or array of paths
          resources: [
            './path/to/vars.scss',
            './path/to/mixins.scss',
            './path/to/functions.scss',
          ],
        })
        .end();
    });
  },
};
```

# 参考资料

1. [Vue-cli3.0 使用 less 全局变量](https://juejin.im/post/6844904173893337102)
2. [Globally Load SASS into your Vue.js Applications](https://vueschool.io/articles/vuejs-tutorials/globally-load-sass-into-your-vue-js-applications/)
3. [sass-resources-loader](https://github.com/shakacode/sass-resources-loader)
