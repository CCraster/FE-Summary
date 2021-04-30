# JS 动态加载

`动态加载的计算机领域的定义`<sup>[[1]](https://en.wikipedia.org/wiki/Dynamic_loading)</sup>：计算机程序在运行时把库（或其他二进制文件）加载进内存，检索库中包含的函数和变量的地址，执行这些函数或访问这些变量，然后卸载内存中的库。

`在js中所说的动态加载更注重于加载，对卸载的关注寥寥。`

## 为什么需要动态加载

**优点：**

1. 减小初始包的大小，加速首屏展示
2. 若有些包一直未被加载，可以减少用户流量损耗

**需要注意：**

1. 避免重复打包
2. 注意增加 http 请求的损耗，拆出来的包大小不宜太小（webpack 对于最小包的要求是 32KB，可以作为参考）
3. 如果拆出来包会影响页面结构，注意避免其带来的闪屏问题

## 自己动手实现动态加载

## webpack 的动态加载

## 框架中的动态加载

### Vue

### React

## 参考资料

1. [Dynamic_loading](https://en.wikipedia.org/wiki/Dynamic_loading)
2. [Loading JavaScript without blocking](https://humanwhocodes.com/blog/2009/06/23/loading-javascript-without-blocking/)
3. [Load JavaScript files dynamically](https://aaronsmith.online/easily-load-an-external-script-using-javascript/)
4. [动态加载 js 文件的正确姿势](https://github.com/letiantian/how-to-load-dynamic-script)
5. [js 怎么动态加载 js 文件（JavaScript 性能优化篇）](https://cloud.tencent.com/developer/article/1529732)

6. [webpack dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)
7. [使用 AMD、CommonJS 及 ES Harmony 编写模块化的 JavaScript](https://justineo.github.io/singles/writing-modular-js/)
