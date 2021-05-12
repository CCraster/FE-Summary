# JS 动态加载

`wiki百科中动态加载在计算机领域的定义`<sup>[[1]](https://en.wikipedia.org/wiki/Dynamic_loading)</sup>：计算机程序在运行时把库（或其他二进制文件）加载进内存，检索库中包含的函数和变量的地址，执行这些函数或访问这些变量，然后卸载内存中的库。

`在js中所说的动态加载更注重于加载，对卸载则不怎么关注。`

## 为什么需要动态加载

`不想/不需要一次性加载所有js文件`

### 动态加载的好处

1. 减小初始包的大小，加速首屏展示
2. 若有些包一直未被加载，可以减少用户流量损耗

### 需要注意的点

1. 注意增加 http 请求的损耗，拆出来的包大小不宜太小（webpack 推荐包最小 size 为 32KB，最大 size 为 256KB，可以作为参考）
2. 如果拆出来包会影响页面结构，注意避免其带来的闪屏问题

## 自己动手实现动态加载

常见的有以下四种动态加载 js 的方式：

### 1. document.write

```js
document.write('<script src="./src/1.document.write.js"></script>');
```

**注意：**

- 在已加载完成的文档中使用`document.write`会清空之前的文档内容

### 2. 改变已有 script 的 src

```js
const indexScript = document.getElementById('script_id');
indexScript.removeAttribute('src');
indexScript.setAttribute('src', './src/2.change_current_script_src.js');
```

**注意：**

- 该已存在的`script`元素必须是没有 src 属性的，不然浏览器不会去请求新 src 对应的脚本

### 3. 借助 XMLHTTP

```js
// 利用xhr把js内容请求回来，再塞入一个内联脚本标签中
const xhr = new XMLHttpRequest();
xhr.open('get', './src/3.use_xmlhttp.js', true);
xhr.onreadystatechange = () => {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.text = xhr.responseText;
      document.body.appendChild(script);
    }
  }
};
xhr.send(null);
```

### 4. 动态创建 script 元素（`推荐方式`）

```js
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = './src/4.append_script.js';
document.head.append(script);
```

## webpack 的动态加载

有两种触发`webpack`自动进行`code split`的方式：

### 1. import()

```js
import('path/to/js').then((exportContent) => {
  // do something...
});
```

### 2. require.ensure()

> 语法
>
> `require.ensure(dependencies: String[], callback: function(require), errorCallback: function, chunkName: String)`

`require.ensure的依赖可以被使用，但没有被执行`

```js
require.ensure(
  ['./dependencies.js'],
  (require) => {
    const exportContent = require('path/to/js');
    // do something...
  },
  () => {
    console.log('loading error')
  }
  'chunkName'
);
```

**注意**

`在webpack中，并不是使用了以上两种语法就可以实现js动态加载的，以上两种方式只会触发code split，要做到js动态加载还需要让分割出的代码没有被立即执行。`

```js
function A() {
  require.ensure([], (require) => {
    const exportContent = require('path/to/js');
    // do something...
  });
}
```

### 动态加载的包名称配置

- 默认情况下 webpack 会使用`模块id`来命名
- 如果配置了 webpack `ouput`的`filename`，会使用`模块id + filename`来命名
- 如果配置了 webpack `ouput`的`chunkFilename`，会使用`chunkFilename`来命名，`chunkFilename`优先级高于`filename`
- 使用魔法注释`/* webpackChunkName: 'chunkName' */`来配置包名，其优先级 < `filename` < `chunkFilename`

```js
import(/* webpackChunkName: 'chunkName' */ 'path/to/js').then(
  (exportContent) => {
    // do something...
  }
);
```

## 框架中的动态加载

对于使用 webpack 进行打包的框架而言，之前讲的 webpack 的方式都是适用的。其中涉及到前端路由懒加载的地方，路由源代码进行下兼容就可以了。

### Vue

vue 的懒加载路由必须是这样的形式：`() => import('./MyPage.vue')`

## 参考资料

1. [Dynamic_loading](https://en.wikipedia.org/wiki/Dynamic_loading)
2. [Loading JavaScript without blocking](https://humanwhocodes.com/blog/2009/06/23/loading-javascript-without-blocking/)
3. [Load JavaScript files dynamically](https://aaronsmith.online/easily-load-an-external-script-using-javascript/)
4. [动态加载 js 文件的正确姿势](https://github.com/letiantian/how-to-load-dynamic-script)
5. [js 怎么动态加载 js 文件（JavaScript 性能优化篇）](https://cloud.tencent.com/developer/article/1529732)
6. [使用 webpack 代码分割和魔术注释提升应用性能](https://segmentfault.com/a/1190000039134142)
7. [webpack dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)
8. [使用 AMD、CommonJS 及 ES Harmony 编写模块化的 JavaScript](https://justineo.github.io/singles/writing-modular-js/)
