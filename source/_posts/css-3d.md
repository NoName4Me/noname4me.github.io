---
title: css3中3D相关样式浅尝
date: 2018-03-22 22:26:25
categories:
- 前端
- CSS
tags:
- transform
- 3D
---

本文涉及几个CSS样式：`perspective`、`perspective-origin`、`backface-visibility`、`transform-style`。

# 1. `perspective`和`perspective-origin`

`perspective`设置z=0那层与用户之间的距离，这样有3D定位的元素，如果其z轴方向上的距离大于0，那么就会比小于0的元素看起来大。

`perspective-origin`设置视角的位置，默认在（设置`perspective`的）元素中心，用法类似`transform-origin`，相对于元素的左上角。

<!--more-->

看一个设置了`perspective`和没有设置，内部元素沿着X轴旋转45度的对比（左：一般图形，中：元素X轴旋转45度，右：设置`perspective`，元素X轴旋转45度。

{% raw %}
<p data-height="212" data-theme-id="dark" data-slug-hash="zWwXwR" data-default-tab="css,result" data-user="blurnull" data-embed-version="2" data-pen-title="CSS-3D-demo-01" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/zWwXwR/">CSS-3D-demo-01</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

元素在Z轴移动的效果：

{% raw %}
<p data-height="224" data-theme-id="dark" data-slug-hash="jzwOWJ" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="CSS-3D-demo-02" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/jzwOWJ/">CSS-3D-demo-02</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

# 2. `backface-visibility`和`transform-style`

`backface-visibility`：`hidden`|`visible`，拥有元素的背面是否可见（比如设置了`hidden`，那么Z轴旋转180度，这个元素会隐藏）

*注：一般元素的背面是其正面的镜像。*

`transform-style`：`preserve`会让内部元素拥有3D布局（见下方示例的图1：平面布局下元素X轴旋转45度，图2：3D布局下元素X轴旋转45度），可以看到图2中，圆形的一半（旋转到z=0平面后的部分）会被遮挡（清晰起见，用了半透明效果）

{% raw %}
<p data-height="240" data-theme-id="dark" data-slug-hash="ZxyEWz" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="CSS-3D-demo-03" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/ZxyEWz/">CSS-3D-demo-03</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

我们稍微扩展一下，两个同位置，同一大小的元素，一个旋转180度，如果设置两个元素不同的内容（颜色什么的），那么当两者同步旋转时（比如沿着X或Y轴），那么就会出现类似旋转硬币的效果，结合不同的视角或背景，就可以作出如上图4的效果（清晰起见，背景用了半透明，图3是静止状态下的样式）。

# 3. 瞬间flat掉你的3D效果的几个坑

有些CSS属性会影响3D效果，让原本炫酷的3D瞬间成为2D，下面来一一分解。

## 3.1 `overflow: hidden`

设置了`overflow:hidden`的元素，会把元素的3d属性（`transform-style: preserve-3d`）置为2d。

* 解决

对于设置为3d的元素不直接设置`overflow:hidden;`，而是给其内部的子元素设置，如下示例第一行（图形1：没有设置`preserve-3d`；图形2：设置了：`preserve-3d`，图形3：并且设置了`overflow:hidden;`；图形4：给子元素设置`overflow:hidden;`）：

{% raw %}
<p data-height="363" data-theme-id="dark" data-slug-hash="Zxovmq" data-default-tab="css,result" data-user="blurnull" data-embed-version="2" data-pen-title="what-flat-3d-CSS" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/Zxovmq/">what-flat-3d-CSS</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

## 3.2 `clip-path`和`opacity`

仍然看上一节的例子，如果在外层设置了3d属性的元素上使用这两个样式，也会导致3d失效，解决方式类似，将这两个属性应用到子元素上。

示例见上节示例中的第2、3行。

-----
# 参考

1. `backface-visibility`及相关：https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility
2. CSS 3D不生效场景：https://css-tricks.com/things-watch-working-css-3d/
