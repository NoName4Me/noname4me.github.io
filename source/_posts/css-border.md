---
title: 使用CSS用border搞点儿事情
date: 2018-03-12 21:36:45
categories:
- 前端
- CSS
tags:
- border
---

# 1. 基础知识

> 未完待续。

## 1.1 `border-radius`

> **注意**`border-radius`一般直接影响背景的形状，而不是其中包含的元素（除非设置了`overflow:hidden`）。

引用W3C上的一张图来说明：

<img src="https://www.w3.org/TR/css-backgrounds-3/images/corner.png" width="300">

<!--more-->

* 如果`border-radius`的值里有`/`，那么前面的定义水平半径（左上角顺时针），后面的定义垂直半径。

* 如果`border-radius`只有一个值（非百分比），且超过了最短边的一半，那么最终值会取最短边的一半。（下方示例中橙色第2个）

{% raw %}
<p data-height="207" data-theme-id="dark" data-slug-hash="WzGawq" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="border-radius" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/WzGawq/">border-radius</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

# 2. 用border做点儿什么

## 2.1 制作三角形

对话框（里的小三角）啊，微调框（里的上下三角箭头）啊什么的。

{% raw %}
<p data-height="217" data-theme-id="dark" data-slug-hash="bvdPvJ" data-default-tab="css,result" data-user="blurnull" data-embed-version="2" data-pen-title="bubble-triangle" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/bvdPvJ/">bubble-triangle</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

----
# 参考

1. [W3C border-radius](https://www.w3.org/TR/css-backgrounds-3/#the-border-radius)