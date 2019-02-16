---
title: SVG中stroke属性实现模拟绘制过程动效
date: 2018-03-20 19:44:34
categories:
- 前端
- CSS
tags:
- SVG
- 动画
---

有这样一种看起来像动态线性绘制的动效（点击`SEND MAIL`触发）：

{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="BrQvRd" data-default-tab="css,result" data-user="blurnull" data-embed-version="2" data-pen-title="100Days-CSS-Challenge-020" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/BrQvRd/">100Days-CSS-Challenge-020</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

<!--more-->

这个的根本是利用SVG图形的描边`stroke`的几个属性来完成，如下拆解：

```scss
$path-length: 100;
path {
    fill: none;
    stroke: red;
    stroke-width: 3;
    stroke-dasharray: $path-length $path-length;
    stroke-dashoffset: $path-length; // 这种偏移整条线，就隐藏了这条线
    animation: paint 1s linear; // 动态改变offset大小，实现模拟绘制
}
@keyframes paint {
    to {
        stroke-dashoffset: 0; // 显示这条线
    }
}
```

示例（左边绿色，从上到下依次为“正常的虚线“、”偏移了一定距离的虚线“、”加了animation的虚线“、”圆滑后的滑动虚线“，右侧为一些扩展）

{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="ZxLVLR" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="SVG-stroke-animation" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/ZxLVLR/">SVG-stroke-animation</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

## 一些说明

* `stroke-linecap`: `butt`、`round`、`square`

<img src="https://www.w3.org/TR/SVG/images/painting/linecap.png" width=360/>

* `stroke-linejoin`: `miter`、`round`、`bevel`

<img src="https://www.w3.org/TR/SVG/images/painting/linejoin.png" width=360/>

* JS获取线条长度

```js
var path = document.querySelector('the selector');
var length = path.getTotalLength();
```

--------

# 参考

1. W3C Stroke Properties: https://www.w3.org/TR/SVG/painting.html#StrokeProperties