---
title: angularjs页面分割和路由（ui-router)
date: 2018-02-26 19:40:58
categories:
- 前端
- JS
tags:
- angularjs
- 路由
---

做页面，经常会遇到这样的需求：

1. 页面太大，需要分割；
2. 单页面众多状态（页面）切换；

在angular框架前提下，第1点一般通过`ng-include`来实现（不存在传递参数、不同状态不同显示等问题），所以多用于页眉／页脚／静态页。第2点一般用`ui-router`来控制。

<!--more-->
# 1. `ng-include`

这个很简单，在html直接包含就可以。
```html
<div ng-include="xxx.html" ng-controller="xxxCtrl"></div>
```

# 2. `ui-router`

## 2.1 基础知识

* router最小单位：

```html
<!-- in index.html -->
<body ng-controller="MainCtrl">
  <section ui-view></section>
</body>
```

```js
// in app-states.js (or whatever you want to name it)
$stateProvider.state('contacts', {
  template: '<h1>My Contacts</h1>'
})
```

激活一个状态有三种方式：

* 调用`$state.go()`，[了解更多](https://github.com/angular-ui/ui-router/wiki/Quick-Reference#stategoto--toparams--options)
* 点击一个包含`ui-sref`指令的链接，[了解更多](https://github.com/angular-ui/ui-router/wiki/Quick-Reference#ui-sref)
* 访问绑定了状态的url，[了解更多](https://github.com/angular-ui/ui-router/wiki/URL-Routing)

也可以给`ui-view`设置默认显示的内容:

```html
<ui-view>
    <i>Some content will load here!</i>
</ui-view>
```

## 2.2 `url`传参

```js
// 路由配置
$stateProvider.state({
    name: 'state1',
    url: '/test/:say',
    templateUrl: 'x',
    controller: 'xx'
});


// 传递参数，url会变为`test/hi~/`
$state.go('state1', {say: 'hi~'}); // 或通过访问url`test/hi~/`传入参数，或在html里ui-sref="state1({say: 'hi~'})">

// controller中获取该参数
$stateParameter.say;
$state.params; // 这个能获取到子状态的参数
```

## 2.3 直接状态带参

```js
$stateProvider.state({
    name: 'state1',
    url: '/test',
    params: {
        say: null
    },
    templateUrl: 'x',
    controller: 'xx'
});
```

使用同`url`传参，不同在于url中不会出现该传递参数。

## 2.4 `ui-view`嵌套以及多个命名views实现页面分割

示例代码[点击这里获取](https://github.com/NoName4Me/blog/tree/master/source/_posts/angularjs-include-ui-router)。

* 嵌套

结果展示：

{% raw %}
<img src="./ui-router-view-nest.png" width="400px" alt="Fig1. ui-view嵌套">
{% endraw %}

关键代码：

```html
    <ui-view>
        <em>Other plain html</em>
        <!--use sub-state to router-->
        <ui-view></ui-view>
    </ui-view>
```

* 多命名views

结果展示：

{% raw %}
<img src="./ui-router-multi-named-views.png" width="400px" alt="Fig1. ui-view嵌套">
{% endraw %}

源码摘要：

```html
<div ui-view="header" class="top"></div>
<div class="bottom">
    <div ui-view="nav" class="left"></div>
    <div ui-view="content" class="right"></div>
</div>
```

```js
$stateProvider.state('main', {
    url: '/main',
    views: {
        'header': {
            template: `
            <strong>This is header~</strong>
            `,
            controller: function($scope) {}
        },
        'nav': {
            template: `
            <strong>navigation~</strong>
            <ul><li>Nav-1</li><li>Nav-2</li><li>Nav-3</li></ul>
            `,
            controller: function($scope) {}
        },
        'content': {
            template: `<strong>This is content~</strong>`,
            controller: function($scope) {}
        }
    }
})
```

# 参考

1. `ui-view`: https://ui-router.github.io/guide/views
1. `multi named views`: https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views