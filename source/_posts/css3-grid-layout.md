---
title: CSS3 Grid布局学习
date: 2017-10-22 17:37:57
categories:
- 前端
- CSS
tags:
- grid layout
---

# 1. 开箱
基本原理：将某个容器按照行、列划分，形成最小单元，然后设置内容占据单元个数（行、列）。为了我们更顺滑的布局，点赞。

兼容性的话……貌似还需要一段时间才能遍地开花呢：

{% asset_img css-grid-caniuse.jpg Fig1. CSS3 Grid Layout CanIuse %}

# 2. 使用

假设有这样一个页面结构：
```html
<div class="container">
    <div class="item">I-1</div>
    <div class="item">I-2</div>
    <div class="item">I-3</div>
    <div class="item">I-4</div>
</div>
```
<!-- more -->
## 2.1 设置容器以网格形式呈现

```js
.container {
    display: grid;
}
```

## 2.2 画网格

`grid-template-rows`和`grid-template-columns`设置行、列占比。
```css
grid-template-rows: 1fr; /* 1行，百分百宽，fr类似于占比 */
grid-template-rows: 1fr 2fr; /* 2行，高度三等分，第1行占1份，第2行占2份 */
grid-template-rows: 1fr 20px 2fr; /* 3行，高度减去20px然后三等分，第1行占1份，第3行占2份，第2行高20px */
grid-template-rows: 20px repeat(2, 1fr, 2fr); /* 5行，高度减去20px然后5等分，第2行占1份，第3行占2份，第4行占1份，第5行占2份 */
```
假设如下设置
```css
container {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(4, 1fr);
}
```

那么我们会得到这样的网格（图中黑色底线）:

{% asset_img css-grid-diy.jpg Fig2. CSS3 Grid Demo1 %}

## 2.3 设置行列间隔
`grid-gap: row column`，也可以通过`grid-row-gap`和`grid-column-gap`单独设置。

## 2.4 设置元素位置

如果不设置，则默认元素按照阅读顺序填充单元格。


通过每一个元素的`grid-column`和`grid-row`设置占比，比如：`grid-column:1/3;`意思是元素`宽`等于从第`1`条网格线到第`3`条网格线之间的距离（网格线见上图Fig2中的序号）。


同样的，`grid-column`可以拆分为`grid-column-start`和`grid-column-end`，`行`同理。

如下设置，效果见前图。
```css
.blue {
    grid-row: 1;
    grid-column: 1 / 4;
}

.purple {
    grid-row: 1 / 2;
    grid-column: 2 / 4;
}

.brown {
    grid-row: 3;
}

.red {
    grid-row: 3;
    grid-column: 4;
}
```
另外，`z-index`设置层叠次序。

# 3. 一个简单的DEMO
{% raw %}
<h3>CSS Grid Layout Playground</h3>
<p data-height="360" data-theme-id="dark" data-slug-hash="WZWZJR" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="css-grid Layout Playground" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/WZWZJR/">css-grid Layout Playground</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

----
**参考**

[MDN CSS3 Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)