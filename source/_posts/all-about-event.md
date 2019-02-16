---
title: 前端常见Event总结（待续）
date: 2017-11-12 21:51:35
categories:
- 前端
- JS
tags:
- DomEvent
---

小角度总结一下事件。

{% asset_img Event.png Fig1. Events in This Post %}

<!-- more -->

# 0. 事件派发和传播

一个事件可以通过`dispatchEvent()`来派发，事件对象（object）通过DOM事件流（flow）来沿着事件传播路径（propagation path）传递给事件目标（target）。在派发前，先要决定传播路径，然后会经历事件一个或多个阶段。事件阶段有三个（如下图所示）：捕获阶段、定位阶段、冒泡阶段。如果`bubbles`被取消，那么就会跳过冒泡阶段，如果在派发之前调用了`stopPropogation()`，那么所有的阶段都会被跳过。

* 捕获阶段（capture phase）：事件对象从`Window`传递到事件目标的父元素。
* 定位阶段（target phase）：事件对象到达事件目标，如果设置了不冒泡，那么就会在此阶段完成后停止。
* 冒泡阶段（bubble phase）：事件对象从事件目标的父元素传递回`Window`。

图：DOM树中的事件派发说明

![img](https://www.w3.org/TR/DOM-Level-3-Events/images/eventflow.svg)

# 1. MouseEvent

## 1.1 鼠标悬浮

一共有两对，`mouseenter`/`mouseleave`和`mouseover`/`mouseout`，两者的区别如下：

1. 后者会事件冒泡（经历事件的冒泡步骤），前者只会触发当前层，而冒泡的好处在于只会被触发一次（层级较深时能有效减少开销）；
2. mouseleave与mouseout，后者在离开子层（即使仍然在范围内）也会触发事件，前者不会。

请看示例（仔细体会）：

{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="bYWBzv" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="all-about-event" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/bYWBzv/">all-about-event</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
{% endraw %}



## 1.2 鼠标点击

一次左键单击触发事件：`mousedown`-->`mouseup`-->`click`
一次左键双击触发事件：`mousedown`-->`mouseup`-->`click`-->`mousedown`-->`mouseup`-->`click`-->`dblclick`
一次中键单击触发事件：`mousedown`-->`mouseup`
一次右键单击触发事件：`mousedown`-->`contextmenu`

请看示例：

{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="OOgVLy" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="Event-MouseClick" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/OOgVLy/">Event-MouseClick</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

## 1.3 滚动（轮）
触发顺序：`wheel` --> `scroll`，即使无法滚动时也能触发`wheel`事件。

请看示例（Chrome浏览器），注意当无法滚动时，触发的事件：
{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="bYoJgx" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="scroll-wheel" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/bYoJgx/">scroll-wheel</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
{% endraw %}


[浏览器兼容方案参考官方示例](https://developer.mozilla.org/en-US/docs/Web/Events/wheel#Listening_to_this_event_across_browser)

## 1.4 鼠标事件忽略

要想使元素不响应`MouseEvent`（无法鼠标点击触发`hover`、`focus`样式，**`TAB`键可以触发哦**），即让其被鼠标事件忽略该元素，直接穿透到其下方元素，设置样式`pointer-events:none;`即可。

请看示例：

{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="ooeKpG" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="make-it-selectable" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/ooeKpG/">make-it-selectable</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

# 2. KeyboardEvent
>**Note:** 如果是为了处理输入事件，最好使用`InputEvent`，因为`KeyboardEvent`只代表键盘事件，非键盘的输入可能无法如你所愿哦～

## 2.1 基础
响应顺序：`keydown` --> `keyup` --> `keypress`。

[键盘编码参考KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code#Code_values_on_Windows)

[在线获取keyCode](http://keycode.info/)

`// TODO add select article link.`
一般的，非输入DOMElement无法响应`KeyboardEvent`，但是可以添加`tabindex=数字`属性强制让其可以focus，从而响应（见`1.4`节示例）。

## 2.2 组合键

`Ctrl`、`Shift`、`Alt`、`Meta`在键盘事件中都有对应的标志位(`true/false`)：`ctrlKey`、`shiftKey`、`altKey`、`metaKey`。

请看示例（Ctrl+c/v复制小球）：

{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="POERXz" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="combined-key" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/POERXz/">combined-key</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

# 3. 其它

## 3.1 绑定事件

除了常见的在html里用`onXx="eventProcess()"`绑定js中定义的函数外，还可以在js中查询元素，然后绑定事件，比如`document.querySelector("#aBtn").onclick = function btnClick(){}`，或者`addEventLister()`来绑定。

### 3.1.1 `addEventListener()`

* `target.addEventListener(type, listener[, options]);`

|参数|说明|
|----|----|
|`type`|类型，大小写敏感|
|`listener`|当特定`type`事件发生时，此`listener`会收到通知，必须是JS函数，或者实现了`EventListener`接口的对象|
|`options`|可选，有`capture`（表示这种`type`的事件是否会在派发到注册的`listener`之前被派发给其它任何在DOM树结构上次于它的`EventTarget`）、`once`（是否只在添加之后只会激活一次，`true`代表在激活后会自动移除注册的`listener`）、`passive`（表示`listener`永远也不会调用`preventDefault()`，如果调用了，那么它会忽略，并在console显示警告信息，查看[Improving scrolling performance with passive listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners)了解更多）|

其它参数感兴趣可以查看[DOC](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)。

* `target.addEventListener(type, listener[, useCapture]);`

`userCapture`参数与`optons`中的`capture`一样。

两个知识点：[JavaScript Events Order](https://www.quirksmode.org/js/events_order.html#link4)、[DOM Level 3 Events](https://www.w3.org/TR/DOM-Level-3-Events/#event-flow)

## 3.2 自定义事件

一般可以通过类似下面这种套路来定义／绑定／派发事件，带参数的事件可以参考[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)，当然，你也可以自定义特定事件，比如`new MouseEvent('')`。

```js
// 创建事件
var event = new Event('build');
// 旧时代使用的创建及初始化方法
// var event = document.createEvent('Event');
// event.initEvent('build', true, true);

// 监听事件
elem.addEventListener('build', function (e) { ... }, false);

// 派发事件
elem.dispatchEvent(event);
```

**注意**：`dispatchEvent`是事件创建、初始化、派发的最后一步，如果该事件是可取消的且已经被至少一个Event handler处理过，就会返回`false`，否则返回`true`，点击查看[dispatchEvent DEMO](https://developer.mozilla.org/samples/domref/dispatchEvent.html)。