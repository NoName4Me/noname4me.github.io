---
title: 画个圈，假装是轮子
date: 2018-04-02 20:26:57
categories:
- 前端
- JS
tags:
- 框架
---

*本文主要说明如何造一个超轻量的框架，比如xxx行实现vue或AngularJs。（文章比较长，就不拆分了-__-。）*

<!--more-->

# 1. 基本概念

# 2. vue

# 3. AngularJs

## 3.1 说明

我们会用到AngularJs的三个组件：

* Controllers
* Directives
* Services

为了实现这些功能，我们首先需要实现`$compile`服务，我们这里叫做`DOMCompiler`，以及`$provider`服务和`$injector`服务，这两个封装到组件`Provider`里，为了实现双向数据绑定，我们实现`Scope`层级，`DOMCompiler`、`Provider`、`Scope`的关系如下：

```js
//      DOMCompiler
//       /     \
//     _/       \_
//   Provider  Scope
```

* `Provider`

前面已经说过，`Provider`会合并框架的两个模块：`$provide`和`$injector`。

它是单例的，并且应该提供如下功能：

1. 注册组件（模块），比如指令、服务、控制器；
2. 解析组件的依赖项；
3. 初始化组件。

* `DOMCompiler`

`DOMCompiler`也是一个单例，它遍历DOM树，来寻找指令（比如AngularJs中的`ng-if`、`ng-repeat`这些），这里简单起见，我们只支持属性形式的指令。当`DOMCompiler`找到给定的指令，它会提供作用域管理功能（因为指令可能需要新的作用域），并且激活绑定给它的逻辑（在本文示例指的是`link`函数），所以它的主要功能如下：

1. 编译DOM；
2. 遍历DOM树；
3. 找到注册的（属性形式的）指令；
4. 激活绑定给它们的逻辑；
5. 管理作用域。

* `Scope`

为了实现数据的双向绑定，我们需要给属性附加上`$scope`，我们可以把这些属性组合成表达式然后监听它们，当我们发现表达式的值有改变时，我们就激活绑定在表达式上的回调函数（观察器）。

它的主要功能：

1. 监听表达式；
2. 在每个`$digest`循环周期里求表达式的值，直到值不再改变；
3. 激活绑定在监听表达式上的观察器。

## 3.2 实现

源码获取，[点击这里](https://github.com/NoName4Me/tiny-wheel)。

### 3.2.1 `Provider`

根据前面说到的它的功能，它需要以下几个接口：

* `get(name, locals)`：根据`name`和本地依赖项返回服务
* `invoke(fn, locals)`：通过工厂方法和本地依赖项初始化服务
* `directive(name, fn)`：通过`name`和工厂注册服务
* `controller(name, fn)`：通过`name`和工厂注册控制器（注意：控制器不是AngularJs的核心，它们只是通过`$controller`服务实现的）
* `service(name, fn)`：通过`name`和工厂注册服务
* `annotate(fn)`：返回某个服务的依赖项名字（数组格式）

**注意：**这里说一下依赖项的问题，AngularJs有两种依赖，本地（局部）依赖和全局依赖，后者是在任何组件都能访问到的依赖（比如`$http`、`$resource`），局部依赖是针对某个特定组件的依赖，比如`$scope`、`$delegate`。

具体实现从代码里说：

```js

var Provider = {
    _cache: { $rootScope: new Scope() }, // 默认先缓存$rootScope，因为全局只有一个，_cache保存激活的各个组件
    _providers: {}, // 用来换存注册的工厂方法（指令的、控制器的、服务的），可以看到directive／service／controller的调用都委托给了_register
    _register: function (name, factory) { // 内部函数，用来统一注册指令、控制器、服务
        this._providers[name] = factory;
    }
    get: function (name, locals) {
      if (this._cache[name]) { // 如果某个组件存在，直接返回
        return this._cache[name];
      }
      var provider = this._providers[name];
      if (!provider || typeof provider !== 'function') { // 没有注册，返回null
        return null;
      }
      // 找到这个组件的provider，并激活它
      return (this._cache[name] = this.invoke(provider, locals));
    },
    directive: function (name, fn) {
      this._register(name + Provider.DIRECTIVES_SUFFIX, fn); // 委托给_register来调用
    },
    controller: function (name, fn) { // 注册：Provider.controller('xxCtrl', ctrlFunc)，ctrlFunc的形式参考annotate
      this._register(name + Provider.CONTROLLERS_SUFFIX, function () {
        return fn; // 因为controller会被调用多次，我们不想保留之前调用产生的值，所以包裹在函数里返回
      });
    },
    service: function (name, fn) {
      this._register(name, fn);
    },
    annotate: function (fn) {
      var res = fn.toString() // 比如有个控制器：`function SomeCtrl(depend1, /* some thing, other things */ depend2, $http) { }`
          .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '') // 这个是为了拿掉注释，成为：`function SomeCtrl(depend1, depend2, $http) { }`
          .match(/\((.*?)\)/); // 取括号里的依赖项：`depend1, depend2, $http`
      if (res && res[1]) {
        return res[1].split(',').map(function (d) { // 通过`,`分割取到依赖名数组
          return d.trim();
        });
      }
      return [];
    },
    invoke: function (fn, locals) {
      locals = locals || {};
      var deps = this.annotate(fn).map(function (s) { // 取依赖项
        return locals[s] || this.get(s, locals); // 可能有多级依赖，注意这里没有考虑循环依赖的问题
      }, this);
      return fn.apply(null, deps); // 注意这里，fn是传入的工厂方法，会返回一个东西（比如控制器啊、服务啊什么的）
    }
};
Provider.DIRECTIVES_SUFFIX = 'Directive';
Provider.CONTROLLERS_SUFFIX = 'Controller';
```

用法：

```js
// 注册一个服务：RESTfulService
Provider.service('RESTfulService', function () {
  return function (url) {
    // make restful call & return promise
  };
});

// 注册一个控制器：MainCtrl，它依赖前面注册的RESTfulService
Provider.controller('MainCtrl', function (RESTfulService) {
  RESTfulService(url)
  .then(function (data) {
    alert(data);
  });
});

// 激活MainCtrl
var ctrl = Provider.get('MainCtrl' + Provider.CONTROLLERS_SUFFIX);
Provider.invoke(ctrl);
```

棒棒的，我们已经完成了四分之一的工作。

### 3.2.2 `DOMCompiler`

同样的，回忆前面关于它应该具有的功能，我们设计两个接口：

* `bootstrap()`：启动应用（类似于angular.bootstrap，但是这里固定使用根HTML作为应用的根）
* `compile(el, scope)`：激活所有绑定在指定元素（`el`）上的逻辑，并且递归的为`el`子元素调用此接口，我们需要一个绑定给当前元素的作用域，从而实现数据绑定，由于每个指令都会创建不同的作用域，所以我们需要在递归调用时，附带上作用域。

```js
var DOMCompiler = {
    bootstrap: function () {
      this.compile(document.children[0],
        Provider.get('$rootScope')); // 还记得前面Provider._cache里默认生成的$rootScope么
    },
    compile: function (el, scope) {
      var dirs = this._getElDirectives(el);
      var dir;
      var scopeCreated;
      dirs.forEach(function (d) {
        dir = Provider.get(d.name + Provider.DIRECTIVES_SUFFIX);
        if (dir.scope && !scopeCreated) { // 是否需要创建作用域以及是否已创建
          scope = scope.$new();
          scopeCreated = true;
        }
        dir.link(el, scope, d.value); // 激活该指令定义的逻辑
      });
      Array.prototype.slice.call(el.children).forEach(function (c) {
        this.compile(c, scope);
      }, this);
    },
    _getElDirectives: function (el) {
      var attrs = el.attributes; // 最开始有提到，只实现了属性方式的绑定，所以……
      var result = [];
      for (var i = 0; i < attrs.length; i += 1) {
        // 查找是否是注册的指令
        if (Provider.get(attrs[i].name + Provider.DIRECTIVES_SUFFIX)) {
          result.push({
            name: attrs[i].name,
            value: attrs[i].value
          });
        }
      }
      return result;
    }
};
```

### 3.2.3 `Scope`

* `$watch(expr, fn)`：坚挺表达式 `expr`，一旦监测到值的改变，就用新的值激活回调函数 `fn`
* `$destroy()`：销毁当前作用域
* `$eval(expr)`：计算表达式 `expr` 在当前作用域下的值
* `$new()`：创建一个新的作用域，原型继承调用者（的作用域）
* `$digest()`：执行脏检查循环

```js
function Scope(parent, id) {
  'use strict';
  this.$$watchers = [];
  this.$$children = [];
  this.$parent = parent;
  this.$id = id || 0;
}

Scope.counter = 0;

Scope.prototype.$watch = function (exp, fn) {
  'use strict';
  this.$$watchers.push({
    exp: exp,
    fn: fn,
    last: Utils.clone(this.$eval(exp))
  });
};

Scope.prototype.$eval = function (exp) {
  var val;
  if (typeof exp === 'function') {
    val = exp.call(this);
  } else {
    try {
      with (this) {
        val = eval(exp);
      }
    } catch (e) {
      val = undefined;
    }
  }
  return val;
};

Scope.prototype.$new = function () {
  'use strict';
  Scope.counter += 1;
  var obj = new Scope(this, Scope.counter);
  Object.setPrototypeOf(obj, this); // 将新生成的作用域原型指向当前作用域
  this.$$children.push(obj);
  return obj;
};

Scope.prototype.$destroy = function () {
  'use strict';
  var pc = this.$parent.$$children; // 从父作用域的子作用域数组中删除自己
  pc.splice(pc.indexOf(this), 1);
};

Scope.prototype.$digest = function () { // 遍历watcher里所有项
  'use strict';
  var dirty, watcher, current, i;
  do {
    dirty = false;
    for (i = 0; i < this.$$watchers.length; i += 1) {
      watcher = this.$$watchers[i];
      current = this.$eval(watcher.exp);
      if (!Utils.equals(watcher.last, current)) {
        watcher.last = Utils.clone(current);
        dirty = true;
        watcher.fn(current);
      }
    }
  } while (dirty);
  for (i = 0; i < this.$$children.length; i += 1) {
    this.$$children[i].$digest();
  }
};
```

### 3.2.4 定义几个指令

* 单向数据绑定`ngl-bind`

```js
Provider.directive('ngl-bind', function () {
  return {
    scope: false,
    link: function (el, scope, exp) {
      el.innerHTML = scope.$eval(exp);
      scope.$watch(exp, function (val) {
        el.innerHTML = val;
      });
    }
  };
});
```

* 双向绑定`ngl-model`

```js
Provider.directive('ngl-model', function () {
  return {
    link:  function (el, scope, exp) {
      el.onkeyup = function () {
        scope[exp] = el.value; // 简单起见，只用于input
        scope.$digest();
      };
      scope.$watch(exp, function (val) {
        el.value = val;
      });
    }
  };
});
```

* 指定控制器`ngl-controller`

控制器需要新的作用域，所以 `scope` 设置为 `true` ，通过 `Provider.get` 获取控制器，然后激活它，在控制器里，我们可以给作用域增加属性，我们可以使用`ngl-bind/model`来绑定这些属性，当属性值改变后，我们需要确保 `$digest` 被激活，从而`ngl-bind/model`关联的监听器被激活。

```js
Provider.directive('ngl-controller', function () {
  return {
    scope: true,
    link: function (el, scope, exp) {
      var ctrl = Provider.get(exp + Provider.CONTROLLERS_SUFFIX);
      Provider.invoke(ctrl, { $scope: scope });
    }
  };
});
```

* 点击事件绑定`ngl-click`

```js
Provider.directive('ngl-click', function () {
  return {
    scope: false,
    link: function (el, scope, exp) {
      el.onclick = function () {
        scope.$eval(exp); // html里绑定时要带括号的哦
        scope.$digest();
      };
    }
  };
});
```

### 3.2.5 试试这个小轮子

```html
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body ngl-controller="MainCtrl">
  <span ngl-bind="bar"></span>
  <button ngl-click="foo()">Increment</button>
</body>
</html>
```

```js
// 注册一个名为 MainCtrl 的控制器
Provider.controller('MainCtrl', function ($scope) {
  $scope.bar = 0;
  $scope.foo = function () {
    $scope.bar += 1;
  };
});

// 启动编译～
DOMCompiler.bootstrap();
```

一开始 `DOMCompiler` 发现 `ngl-controller` 指令，这个指令的 `link` 函数创建新作用域并且传递给控制器的函数，控制器里我们添加了属性 `bar` ，以及函数 `foo` ， `DOMCompiler` 发现 `ngl-bind` ，然后给它关联的属性 `bar` 添加监听器， `DOMCompiler` 还发现 `ngl-click` 指令，并为按钮绑定事件处理程序。

如果用户点击了按钮， `foo` 方法会通过 `$scope.$eval` 被计算然后调用， `$scope` 类似， 它被当作值传递给 `MainCtrl` 。然后， `ngl-click` 激活了 `$scope.$digest` 。`$digest` 遍历所有的监听器，检测表达式 `bar` 值的变化， 因为我们已经在 `ngl-bind` 指令定义中给定了回调函数（ `$watch`里的`function(val) {el.innerHTML = val;}`），此时该函数会被调用，然后我们看到 `span` 元素的值被更新。

-----
# 参考

1. <span class="fa fa-fw fa-file-text" style="margin-right: 8px;"></span>[250行实现一个简单的MVVM](https://saul-mirone.github.io/2016/12/19/simple-mvvm/)
2. <span class="fa fa-fw fa-file-text" style="margin-right: 8px;"></span>[Build Your own Simplified AngularJS in 200 Lines of JavaScript](http://blog.mgechev.com/2015/03/09/build-learn-your-own-light-lightweight-angularjs/)
3. <span class="fa fa-book" style="margin-right: 8px;"></span>[*Build Your Own AngularJS*, by Tero Parviainen](http://teropa.info/build-your-own-angular/)