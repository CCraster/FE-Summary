/**
 * 双向数据绑定 - 数据劫持，类似vue
 * 只能简单的替换元素的text，更复杂的功能没有，不好用
 */
export default class XVue {
  constructor(options) {
    this._init(options);
  }

  _init(options) {
    this.$el = document.querySelector(options.el);
    this.$data = options.data;
    this.$methods = options.methods;
    this._binding = {};

    this._observe(this.$data);
    this._compile(this.$el);
  }

  _observe(obj) {
    let arr = Object.keys(obj);
    for (const key of arr) {
      this._binding[key] = {
        _directives: [],
      };
      let value = obj[key];
      // 先只考虑object 不考虑数组
      typeof value === 'object' ? this._observe(value) : '';
      let binding = this._binding[key];

      Object.defineProperty(this.$data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
          return value;
        },
        set: function (newValue) {
          if (newValue !== value) {
            value = newValue;
            binding._directives.forEach(function (item) {
              item.update();
            });
          }
        },
      });
    }
  }

  _compile(root) {
    let nodes = root.children;
    for (const node of nodes) {
      if (node.children.length) {
        this._compile(node);
      } else if (node.hasAttribute('v-click')) {
        node.onclick = (() => {
          var method = node.getAttribute('v-click');
          return this.$methods[method].bind(this.$data);
        })();
      } else if (
        node.hasAttribute('v-model') &&
        (node.tagName === 'INPUT' || node.tagName == 'TEXTAREA')
      ) {
        node.addEventListener(
          'input',
          (() => {
            let attrVal = node.getAttribute('v-model');
            this._binding[attrVal]._directives.push(
              new Watcher('input', node, this, attrVal, 'value')
            );
            return () => {
              this.$data[attrVal] = node.value;
            };
          })()
        );
      } else if (node.hasAttribute('v-bind')) {
        var attrVal = node.getAttribute('v-bind');
        this._binding[attrVal]._directives.push(
          new Watcher('text', node, this, attrVal, 'innerHTML')
        );
      }
    }
  }
}

class Watcher {
  constructor(name, el, vm, exp, attr) {
    this.name = name; // 指令名称，例如文本节点，该值设为"text"
    this.el = el; // 指令对应的DOM元素
    this.vm = vm; // 指令所属myVue实例
    this.exp = exp; // 指令对应的值，本例如"number"
    this.attr = attr; // 绑定的属性值，本例为"innerHTML"

    this.update();
  }
  update() {
    this.el[this.attr] = this.vm.$data[this.exp];
  }
}
