---
title: 可能，你用了假的z-index
date: 2017-12-12 21:28:14
categories:
- 前端
- CSS
tags:
- z-index
- Stacking Context
- 层叠
---

z-index只有在定位元素上才会生效，而且要考虑Stacking Context的层级关系，它只会比较同层的Stacking Context。

以下都会形成一个Stacking Context：
* HTML根元素the root element (HTML)。
* 定位（absolute/relative）元素设置了`z-index`属性（值不为`auto`）。
* flex item（即父元素设置`display: flex | inline-flex`）设置了`z-index`属性（值不为auto）。
* 元素设置了小于1的透明度。
* 元素设置了不为`none`的transform属性。
* 元素设置了值非`normal`的[`mix-blend-mode`](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)属性。
* 元素设置了非`none`的`filter`属性。
<!--more-->
* 元素设置了非`none`的`perspective`属性。
* 元素设置了`isolation: isolate;`。
* 元素设置了`position: fixed`。
* 在[`will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)里设置了以上任何属性（即使没有给该属性特定的值），参考[一篇will-change博文](https://dev.opera.com/articles/css-will-change-property/)。
* 元素设置了`-webkit-overflow-scrolling: touch`。

这些Stacking Context按照定位元素位于普通文档流之上，普通文档流按照后来居上原则，及设置了z-index的情况进行堆叠。

一个小示例：
{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="GmmoaG" data-default-tab="css,result" data-user="blurnull" data-embed-version="2" data-pen-title="Stacking Order" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/GmmoaG/">Stacking Order</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

另外，需要注意，元素默认背景是透明的，在堆叠时，不要被表象所迷惑哦（比如在上层看到了下层的文字，以为堆叠出问题了什么的，建议给元素设置背景色以避免）。