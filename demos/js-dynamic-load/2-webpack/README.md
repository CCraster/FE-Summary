# webpack 打包后辅助函数备忘

- `__webpack_modules__`: 项目代码模块数组
- `__webpack_module_cache__`: 模块的缓存数组
- `__webpack_require__`: require 函数
  - `.m`: 指向`__webpack_modules__`
  - `.n`: 获取模块的默认导出（能兼容 non-harmony 模块）
  - `.d`: 接受两个参数，都是对象，把后者中有但是前者没有的属性加到前者中去
  - `.f`: sd
    - `.j`: ds
  - `.e`:
  - `.u`: 获取异步 js 包的名称
  - `.miniCssF`: 获取 mini css 包名称
  - `.g`: 获取运行环境的全局对象
  - `.o`: 对 hasOwnProperty 的封装，判断对象是否有某属性
  - `.l`: 加载脚本的函数，接受四个参数：脚本 url、完成回调函数、webpack 内部给脚本的 key 和脚本的 chunkId
  - `.nc`: nonce 属性的值（nonce 属性的作用：https://segmentfault.com/a/1190000037408890）
  - `.r`: 给模块的导出对象加上`__esModule`和`Symbol.toStringTag`字段（如果可以加上的话）
  - `.p`: 脚本运行的 publicPath
