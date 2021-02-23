# 实现 apply、call 和 bind

```js
// 实现apply、call、bind
Function.prototype.myapply = function (context, args = []) {
  if (!context || !/^\[object (.*?)]/.test(context.toString())) {
    context = global;
  }
  if (args && !Array.isArray(args)) {
    throw 'Uncaught TypeError: CreateListFromArrayLike called on non-object';
  }
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
};
Function.prototype.mycall = function (context, ...args) {
  if (!context || !/^\[object (.*?)]/.test(context.toString())) {
    context = global;
  }
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
};
/**
 * 1. bind函数有柯里化特性，但bind返回的函数只能接收一次参数就会返回结果
 * 2. bind返回的函数可以通过new去实例化对象
 */
Function.prototype.mybind = function (context, ...args) {
  if (!context || !/^\[object (.*?)]/.test(context.toString())) {
    context = global;
  }
  let _args = args,
    fn = this,
    that = context;
  let fNOP = function () {}; // 利用空函数做个中转，避免修改newFn.prototype 的时候，也会直接修改绑定函数的 prototype
  let newFn = function (...args) {
    let _ctx, result;
    if (this instanceof newFn) {
      _ctx = this;
    } else {
      _ctx = that;
    }
    _ctx.fn = fn;
    result = _ctx.fn(..._args.concat(args));
    delete _ctx.fn;
    return result;
  };
  fNOP.prototype = fn.prototype;
  newFn.prototype = new fNOP();

  return newFn;
};

function logName(prefix = 'prefix', suffix = 'suffix') {
  // 浏览器环境中function里的this指向window对象，nodejs中指向global对象
  console.log(prefix + ': ' + this.name + ', ' + suffix);
}
logName.prototype.info = 'This is logName function';
let obj = { name: 'Craster' };

// test - 原生apply、call、bind
logName();
logName.apply(obj, ['origin apply']);
logName.call(obj, 'origin call');
logName.bind(obj, 'origin bind')('bind can currying once');
let bindFn = logName.bind(obj, 'origin bind');
let newBindFn = new bindFn("new bind's return");
console.log(newBindFn.info);

console.log('------------------------');

// test - 实现的apply、call、bind
logName();
logName.myapply(obj, ['my apply']);
logName.mycall(obj, 'my call');
logName.mybind(obj, 'my bind')('bind can currying once');
let mybindFn = logName.mybind(obj, 'my bind');
let newMybindFn = new mybindFn("new bind's return");
console.log(newMybindFn.info);
```
