---
title: Formatting Context是个啥？
date: 2018-04-11 23:14:27
categories:
- 前端
- CSS
tags:
- BFC
---

> 一些关于Formatting Context的学习笔记。

<!--more-->
# 1. 盒类型

**块级元素**就是视觉上展示为块（比如段落）的元素，`display`设置为`blcok`、`list-item`、`table`都是。

**块容器盒**既可以只包含块级盒子，也可以建立inline formatting context，从而只包含行内级盒子。不是所有的**块容器盒**是**块级盒子**（比如`inline-block`），两者的交集叫做**块盒**。

* 匿名的**块盒**

```html
<div>
    Some text
    <p>More text</p>
</div>
```

上面的结构产生如下三个盒子：

<img src="https://www.w3.org/TR/CSS2/images/anon-block.png" width=360>

如果一个**块容器盒**里有**块级盒子**（比如上面的`p`），那么它会强制内部只能有**块级盒子**。

当一个**行内盒子**包含in-flow（注：不脱离文档流）的**块级盒子**，那么**行盒**会在该**块级盒子**那里被破坏，其前后形成一个匿名的**块盒**，从而该**块级盒子**称为匿名盒子的XDJM，见如下示例：

{% raw %}
<p data-height="149" data-theme-id="dark" data-slug-hash="RMdmdJ" data-default-tab="html,result" data-user="blurnull" data-embed-version="2" data-pen-title="block-box break inline-box" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/RMdmdJ/">block-box break inline-box</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

# 2. Normal Flow

在普通流下的盒子属于一个formatting context，可以是块（block）或行（inline），两者互斥，块盒子对应的是block formatting context（以下简称BFC），行盒子对应的是inline formatting context（IFC）。

## 2.1 BFC

浮动元素、绝对定位（包括`fixed`定位）元素，块容器（比如`inline-block`、`table-cell`、`table-caption`）不是**块盒**。

`overflow` 值不是 `visible` 的**块盒**会为其内容生成一个新的BFC。

在BFC下，遵从下面两个原则：

* 盒子一个挨着一个陈列，从容器顶部开始，相邻盒子之间的距离由`margin`属性决定，相邻**块级盒子**的`margin`会塌陷（最大值生效）。
* 每个盒子的左边界紧贴容器的左边界（如果是r2l布局，则紧贴右侧），即使有浮动元素（尽管盒子的*行盒子*可能因为浮动而收缩），除非盒子创建了一个新的BFC（这样该盒子可能会因为浮动元素而变窄）。

BFC示例：

{% raw %}
<p data-height="375" data-theme-id="dark" data-slug-hash="pLYQZe" data-default-tab="html,result" data-user="blurnull" data-embed-version="2" data-pen-title="formatting-context" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/pLYQZe/">formatting-context</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

## 2.2 IFC

在IFC中，盒子是从容器顶部开始，一个接一个的水平放置，水平`margin`、`border`以及`padding`在盒子之间，这些盒子在垂直方向上有多种对齐方式：`bottom`、`top`、其内文字的`baseline`，包含盒子并形成一行的矩形区域叫做**行盒**。

**行盒**是在IFC内为了持有行内级别的内容而创建的，如果它没有文字、没有保留空白、没有行内元素，没有其它in-flow内容（比如图像，行内块或行内表格），并且没有保留的新行，那它只能被当作一个高度为0的**行盒**，这样做是为了让它里面的元素可以有定位参考，当用于其它目的时应该当作它不存在。

```html
<P>Several <EM>emphasized words</EM> appear
<STRONG>in this</STRONG> sentence, dear.</P>
```

上面的代码如果宽度足够，所有内容在一行，那么就只有一个**行盒**，其中含有5个**行内盒子**：

* 匿名的：`"Serveral"`
* `EM`：`"emphasized words"`
* 匿名的：`"appear"`
* `STRONG`：`"in this"`
* 匿名的：`"sentence, dear."`

而如果宽度不够，那么就会折行，比如下图中的右图，会有两个**行盒**：

{% raw %}
<p data-height="227" data-theme-id="dark" data-slug-hash="vRPMPy" data-default-tab="html,result" data-user="blurnull" data-embed-version="2" data-pen-title="BFC" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/vRPMPy/">BFC</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

# 参考

1. W3C标准LV2（block formatting）：https://www.w3.org/TR/CSS2/visuren.html#block-formatting
2. W3C标准LV3（block formatting）：https://www.w3.org/TR/css-display-3/#formatting-context