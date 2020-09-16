# eslint

[TOC]

## 题外话

这里主要是[eslint](https://cn.eslint.org/)的一些使用备忘，除却 eslint，还有`jslint`和`jshint`也可以完成类似的工作，三者之间的关系和优缺点可以看看这篇文章：[JSLint,JSHint,ESLint 对比](https://cloud.tencent.com/developer/article/1195867)，还是比较有趣的。

## 配置方式

> 配置文件中包含的相对路径和 glob 模式都是基于当前配置文件的路径进行解析的

### 两种配置方式

1. 配置注释

   在目标文件中使用`注释语法`嵌入配置信息，只对当前文件有效

2. 配置文件

   支持`js`，`json`和`yaml`文件，配置信息都写在`.eslintrc.*`的文件中，或者写在`package.json`文件的`eslintConfig`字段中。这样的配置方式**对于配置文件所在的目录和子目录都是有效的**。

### 配置优先级

**多个配置的优先级如下：**

1. .eslintrc.js
2. .eslintrc.yaml
3. .eslintrc.yml
4. .eslintrc.json
5. .eslintrc
6. package.json

## 配置参数

### parser

指定 eslint 的语法分析器，兼容的分析器有：[esprima](https://www.npmjs.com/package/esprima)，[babel-eslint](https://www.npmjs.com/package/babel-eslint)和[@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser)，eslint 默认使用的是 esprima。

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
};
```

### parserOptions

配置语法分析器的选项，默认支持：`ecmaVersion`，`sourceType`，和`module`

```javascript
module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
```

### env

指定 js 代码的运行环境，每种运行环境会有一组预定义的全局变量。

```javascript
module.exports = {
  env: {
    browser: true,
    node: true,
  },
};
```

### globals

使用未在当前文件内定义的全局变量时会发命中`no-undef`规则，在配置之后则不会。

```javascript
module.exports = {
  globals: {
    var1: 'writable', // 历史原因，true和writeable等价于这个，不建议使用
    var2: 'readonly', // 历史原因，false和readable等价于这个，不建议使用
    var3: 'off', // 禁用此全局变量
  },
};
```

### plugins

plugins 是第三方规则的集合，插件中`eslint-plugin-`前缀可以省略。

```javascript
module.exports = {
  plugins: ['plugin1', 'eslint-plugin-plugin2'],
};
```

### extends

extends 用于指定基础配置，它的属性值可以是：

- 指定配置的字符串(配置文件的路径、可共享配置的名称、eslint:recommended 或 eslint:all)
- 字符串数组：每个配置继承它前面的配置

```javascript
module.exports = {
  extends: 'eslint:recommended',
  // 或
  extends: ['eslint:recommended', 'standard'],
};
```

### rules

eslint 具体的规则配置，它的值可以是：

- 0：关闭规则
- 1：开启规则，警告级别，不会导致程序退出
- 2：开启规则，错误级别，当被触发的时候，程序会退出

```javascript
module.exports = {
  rules: {
    eqeqeq: 'warn',
    //你也可以使用对应的数字定义规则严重程度
    curly: 2,
    //如果某条规则有额外的选项，你可以使用数组字面量指定它们
    //选项可以是字符串，也可以是对象
    quotes: ['error', 'double'],
    'one-var': [
      'error',
      {
        var: 'always',
        let: 'never',
        const: 'never',
      },
    ],
    //配置插件提供的自定义规则的时候，格式为：不带前缀插件名/规则ID
    'react/curly': 'error',
  },
};
```

## 完整配置示例

> 可以通过在项目根目录创建一个.eslintignore 文件告诉 ESLint 去忽略特定的文件和目录
>
> .eslintignore 文件是一个纯文本文件，其中的每一行都是一个 glob 模式表明哪些路径应该忽略检测

```javascript
module.exports = {
  //ESLint默认使用Espree作为其解析器
  //同时babel-eslint也是用得最多的解析器
  parser: 'espree',

  //parser解析代码时的参数
  parserOption: {
    //指定要使用的ECMAScript版本，默认值5
    ecmaVersion: 5,
    //设置为script(默认)或module（如果你的代码是ECMAScript模块)
    sourceType: 'script',
    //这是个对象，表示你想使用的额外的语言特性,所有选项默认都是false
    ecmafeatures: {
      //允许在全局作用域下使用return语句
      globalReturn: false,
      //启用全局strict模式（严格模式）
      impliedStrict: false,
      //启用JSX
      jsx: false,
      //启用对实验性的objectRest/spreadProperties的支持
      experimentalObjectRestSpread: false,
    },
  },

  //指定环境，每个环境都有自己预定义的全局变量，可以同时指定多个环境，不矛盾
  env: {
    //效果同配置项ecmaVersion一样
    es6: true,
    browser: true,
    node: true,
    commonjs: false,
    mocha: true,
    jquery: true,
    //如果你想使用来自某个插件的环境时，确保在plugins数组里指定插件名
    //格式为：插件名/环境名称（插件名不带前缀）
    'react/node': true,
  },

  //指定环境为我们提供了预置的全局变量
  //对于那些我们自定义的全局变量，可以用globals指定
  //设置每个变量等于true允许变量被重写，或false不允许被重写
  globals: {
    globalVar1: true,
    globalVar2: false,
  },

  //ESLint支持使用第三方插件
  //在使用插件之前，你必须使用npm安装它
  //全局安装的ESLint只能使用全局安装的插件
  //本地安装的ESLint不仅可以使用本地安装的插件还可以使用全局安装的插件
  //plugin与extend的区别：extend提供的是eslint现有规则的一系列预设
  //而plugin则提供了除预设之外的自定义规则，当你在eslint的规则里找不到合适的的时候
  //就可以借用插件来实现了
  plugins: [
    'eslint-plugin-airbnb',
    //插件名称可以省略eslint-plugin-前缀
    'react',
  ],

  //具体规则配置
  //off或0--关闭规则
  //warn或1--开启规则，警告级别(不会导致程序退出)
  //error或2--开启规则，错误级别(当被触发的时候，程序会退出)
  rules: {
    eqeqeq: 'warn',
    //你也可以使用对应的数字定义规则严重程度
    curly: 2,
    //如果某条规则有额外的选项，你可以使用数组字面量指定它们
    //选项可以是字符串，也可以是对象
    quotes: ['error', 'double'],
    'one-var': [
      'error',
      {
        var: 'always',
        let: 'never',
        const: 'never',
      },
    ],
    //配置插件提供的自定义规则的时候，格式为：不带前缀插件名/规则ID
    'react/curly': 'error',
  },

  //ESLint支持在配置文件添加共享设置
  //你可以添加settings对象到配置文件，它将提供给每一个将被执行的规则
  //如果你想添加的自定义规则而且使它们可以访问到相同的信息，这将会很有用，并且很容易配置
  settings: {
    sharedData: 'Hello',
  },

  //Eslint检测配置文件步骤：
  //1.在要检测的文件同一目录里寻找.eslintrc.*和package.json
  //2.紧接着在父级目录里寻找，一直到文件系统的根目录
  //3.如果在前两步发现有root：true的配置，停止在父级目录中寻找.eslintrc
  //4.如果以上步骤都没有找到，则回退到用户主目录~/.eslintrc中自定义的默认配置
  root: true,

  //extends属性值可以是一个字符串或字符串数组
  //数组中每个配置项继承它前面的配置
  //可选的配置项如下
  //1.字符串eslint：recommended，该配置项启用一系列核心规则，这些规则报告一些常见问题，即在(规则页面)中打勾的规则
  //2.一个可以输出配置对象的可共享配置包，如eslint-config-standard
  //可共享配置包是一个导出配置对象的简单的npm包，包名称以eslint-config-开头，使用前要安装
  //extends属性值可以省略包名的前缀eslint-config-
  //3.一个输出配置规则的插件包，如eslint-plugin-react
  //一些插件也可以输出一个或多个命名的配置
  //extends属性值为，plugin：包名/配置名称
  //4.一个指向配置文件的相对路径或绝对路径
  //5.字符串eslint：all，启用当前安装的ESLint中所有的核心规则
  //该配置不推荐在产品中使用，因为它随着ESLint版本进行更改。使用的话，请自己承担风险
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:react/recommended',
    './node_modules/coding-standard/.eslintrc-es6',
    'eslint:all',
  ],
};
```

## 参考资料

1. [eslint 中文官网](https://cn.eslint.org/)
2. [eslint 配置和 rule 规则解释](https://segmentfault.com/a/1190000020005105)
3. [ESLint 配置文件.eslintrc 参数说明](https://gist.github.com/rswanderer/29dc65efc421b3b5b0442f1bd3dcd046)
