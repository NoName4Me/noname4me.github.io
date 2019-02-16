---
title: MouseEvent中的clientX等定位信息以及元素的clientWidth等尺寸信息
date: 2018-02-26 20:39:04
categories:
- 前端
tags:
- MouseEvent定位
- 元素尺寸
---

# 1. 定位

`clientX`: 与页面可视区左侧的距离
`offsetX`: 与元素左侧的距离
`pageX`: 与document左侧的距离
`screenX`: 与屏幕左侧的距离

兼容浏览器的各个position获取方法：
<!--more-->

```js
// 原文@branneman：https://gist.github.com/branneman/fc66785c082099298955
/**
 * @param {Event} evt
 * @return {Object}
 */
function getMousePosition(evt) {

  var pageX = evt.pageX;
  var pageY = evt.pageY;
  if (pageX === undefined) {
    pageX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    pageY = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  var rect = evt.target.getBoundingClientRect();
  var offsetX = evt.clientX - rect.left;
  var offsetY = evt.clientY - rect.top;

  return {
    client: { x: evt.clientX, y: evt.clientY }, // relative to the viewport
    screen: { x: evt.screenX, y: evt.screenY }, // relative to the physical screen
    offset: { x: offsetX,     y: offsetY },     // relative to the event target
    page:   { x: pageX,       y: pageY }        // relative to the html document
  };
}
```

# 2. 宽高

>参考[stackoverflow上一个优秀回答](https://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively)。

* `offsetWidth` / `offsetHeight`: 包含了边界的盒宽／高，通过`width + padding + border`计算`display:block`的元素；
* `clientWidth` / `clientHeight`: 盒内容的可视部分，不包括边界／滚动条，但是包含内边距`padding`，无法直接通过CSS计算，依赖于系统滚动条大小；
* `scrollWidth` / `scrollHeight`: 盒内容的全部尺寸，包括滚动到可视区域外的部分，无法直接通过CSS计算，依赖于内容；



该回答里的示例如下：

{% raw %}
<p data-height="520" data-theme-id="dark" data-slug-hash="mXzjyo" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="offsetWidth, clientWidth, scrollWidth" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/mXzjyo/">offsetWidth, clientWidth, scrollWidth</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}