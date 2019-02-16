---
title: SVG学习（及实践）笔记
date: 2017-11-19 18:21:00
categories:
- 前端
tags:
- SVG
---

*整理中……*

>学习SVG(Scalable Vector Graphics)的笔记，及记录使用中踩过的坑。

# 1. 基本知识

坐标、基本图形（圆、矩形、线、路径等）。
<!--more-->
## 1.1 关于坐标

## 1.2 基本图形

```html
<!-- 圆，(cx, cy): 圆心, r: 半径 -->
<circle cx="50" cy="50" r="20" stroke="#000" stroke-width="1" fill="#fcc" />

<!-- 椭圆，(cx, cy): 椭圆圆心, (rx,ry): 水平／垂直径 -->
<ellipse cx="140" cy="50" rx="40" ry="20" stroke="#000" stroke-width="2" fill="#cfc"/>

<!-- 矩形，(x, y): 左上角坐标, (rx,ry): 圆角的横向纵向半径 -->
<rect x="200" y="30" width="80" height="40" rx="20" ry="10"  stroke="#000" stroke-width="1" fill="#ccf" />

<!-- 直线，(x1, y1): 起点, (x2,y2): 终点 -->
<line x1="320" y1="20" x2="400" y2="40" stroke="#000" stroke-width="2" />
<!-- 点划线，stroke-dasharray: (实 虚),(实 虚), .... -->
 <line x1="320" y1="40" x2="400" y2="60" stroke="#000" stroke-width="2" stroke-dasharray="10 4, 5 10, 4 4, 4 4" />

<!-- 折线，points: 折线的各个点 -->
<polyline points="420 20, 420 40, 440 40, 440 60, 460, 60" fill="none" stroke="#000" />

<!--线的其它属性-->
<!--
    stroke-linecap: butt | round | square
    stroke-linejoin: miter | round | bevel
-->

<!-- 多边形，或者折线（闭合）填充就是多边形咯 -->
<polygon fill="#ff9faf" stroke="#df4f9f" stroke-width="2" points="500,40 500,70 520,80 540,70 540,40 520,30" />
```

如下图所示：
{% raw %}
<svg style="width:600px;height:100px;box-shadow:0 0 8px 0 rgba(0,0,0,.2);border:1px solid rgba(0,0,0,.1);">
    <circle cx="50" cy="50" r="20" stroke="#000" stroke-width="1" fill="#fcc" />
    <ellipse cx="140" cy="50" rx="40" ry="20" stroke="#000" stroke-width="2" fill="#cfc"/>
    <rect x="200" y="30" width="80" height="40" rx="20" ry="10"  stroke="#000" stroke-width="1" fill="#ccf" />
    <line x1="320" y1="20" x2="400" y2="40" stroke="#000" stroke-width="2" />
    <line x1="320" y1="40" x2="400" y2="60" stroke="#000" stroke-width="2" stroke-dasharray="10 4, 5 10, 4 4, 4 4" />
    <polyline points="420 20, 420 40, 440 40, 440 60, 460, 60" fill="none" stroke="#000" />
    <polygon fill="#ff9faf" stroke="#df4f9f" stroke-width="2" points="500,40 500,70 520,80 540,70 540,40 520,30" />
</svg>
{% endraw %}

## 1.3 path

> 大写字母：相对于起点的定位，小写：相对前一个点的定位

|关键字|行为|说明|
|----|----|---|
|`M`|移动到||
|`L`|绘制直线到||
|`H`|绘制水平线到||
|`V`|绘制垂直线到||
|`Z`|闭合（绘制到起点）||
|`A`|弧线|`A30,40 0 0,0 70,70`: 画一个（从上一个点）到坐标(70,70)横轴30，纵轴40的逆时针小圆弧线|
|`Q`|二次贝塞尔曲线|`Q10,100 40,200`画一个（从上一个点）到坐标(40,200)的以(10,100)为控制点的贝塞尔曲线|
|`T`|二次贝塞尔简写|`T40,200`画一个（从上一个点）到坐标(40,200)的以上一个控制点为控制点的贝塞尔曲线|
|`C`|三次贝塞尔曲线|`C10,40 50,80 100，100`画一个（从上一个点）到坐标(100,100)的以(10,40)和(50,80)为第一、第二控制点的曲线|
|`S`|三次贝塞尔曲线简写|`S50,80 100，100`类似`T`，第一个控制点省略（使用上一个）|

```html
<!-- 封闭折线 -->
<path d="M50,50 L100,30 H150 V80 Z" stroke="#000" stroke-width="1" fill="none" marker-start="url(#start)"/>
<!-- 不封闭折线 -->
<path d="M60,60 L110,40 H160 V90" stroke="#000" stroke-width="1" fill="none" marker-start="url(#start)"/>
<!-- 红色逆时针小圆弧 -->
<path d="M220,40 A40,20 0 0,0 250,60" stroke="#f00" stroke-width="1" fill="none"/>
<!-- 绿色逆时针大圆弧 -->
<path d="M220,40 A40,20 0 1,0 250,60" stroke="#0f0" stroke-width="1" fill="none"/>
<!-- 蓝色顺时针小圆弧 -->
<path d="M220,40 A40,20 0 0,1 250,60" stroke="#00f" stroke-width="1" fill="none"/>
<!-- 青色顺时针大圆弧 -->
<path d="M220,40 A40,20 0 1,1 250,60" stroke="#0ff" stroke-width="1" fill="none" marker-start="url(#start)" marker-end="url(#end)"/>
<!-- 二次贝塞尔 -->
<path d="M320,40 Q340,10 350,60" stroke="grey" stroke-width="1" fill="none" marker-start="url(#start)" marker-end="url(#end)"/>
<!-- 三次贝塞尔 -->
<path d="M320,80 C320,120 420,10 480,50" stroke="grey" stroke-width="1" fill="none" marker-start="url(#start)" marker-end="url(#end)"/>
```

{% raw %}
<svg style="width:600px;height:100px;box-shadow:0 0 8px 0 rgba(0,0,0,.2);border:1px solid rgba(0,0,0,.1);">
  <defs>
    <marker viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth" id="start">
        <circle cx="5" cy="5" r="5" fill="#3A9" stroke="none"></circle>
    </marker>
    <marker viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth" id="end">
        <circle cx="5" cy="5" r="5" fill="#A39" stroke="none"></circle>
    </marker>
  </defs>
  <path d="M10,15 L10,15" marker-start="url(#start)"/>
  <text x="20" y="20">起点</text>
  <path d="M60,15 L10,15" marker-start="url(#end)"/>
  <text x="70" y="20">终点</text>
  <path d="M50,50 L100,30 H150 V80 Z" stroke="#000" stroke-width="1" fill="none" marker-start="url(#start)"/>
  <path d="M60,60 L110,40 H160 V90" stroke="#000" stroke-width="1" fill="none" marker-start="url(#start)"/>
  <path d="M220,40 A40,20 0 0,0 250,60" stroke="#f00" stroke-width="1" fill="none"/>
  <path d="M220,40 A40,20 0 1,0 250,60" stroke="#0f0" stroke-width="1" fill="none"/>
  <path d="M220,40 A40,20 0 0,1 250,60" stroke="#00f" stroke-width="1" fill="none"/>
  <path d="M220,40 A40,20 0 1,1 250,60" stroke="#0ff" stroke-width="1" fill="none" marker-start="url(#start)" marker-end="url(#end)"/>
  <path d="M320,40 Q340,10 350,60" stroke="grey" stroke-width="1" fill="none" marker-start="url(#start)" marker-end="url(#end)"/>
  <path d="M320,80 C320,120 420,10 480,50" stroke="grey" stroke-width="1" fill="none" marker-start="url(#start)" marker-end="url(#end)"/>
</svg>
{% endraw %}



## Coordinate
viewBox=minX,minY width,height
> this can do shift/scale

preserveAspectRatio
```js
preserveAspectRatio="xMinyMin meet"
// xMin - aligned to left, xMid - middle, xMax - aligned to bottom
// yMin - top
// meet: sliced untill the largest side touch the viewport boundary
// slice: scaled and sliced untill the mallest side touch the viewport boundary
```

# 2. 高级知识

* `<defs>` & `<symbol>`：定义
* `<marker>`：标记
* `<use>`：引用

>可以使用viewBox来scale/transform

refX／refY：X／Y轴的偏移
`marker-end`, `marker-start`, `marker-mid`(多节点的线才会有效，即至少3个点）

```html
<defs>
  <!-- 渐变 -->
  <linearGradient id="g1"><!-- x1="0%" y1="0%" x2="0%" y2="100%"这个决定了渐变角度，此时是垂直向下 -->
    <stop offset="20%" stop-color="#3D9" />
    <stop offset="90%" stop-color="#39F" />
  </linearGradient>
  <!--  W|H * markerUnits 计算实际大小 -->
  <marker viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth" id="arrow">
    <path d="M0,0 L0,6 L9,3 Z" fill="#3A9"></path>
  </marker>
</defs>
<symbol>
  <circle cx="50" cy="50" r="20" stroke-width="18" stroke="orange" fill="purple" id="r1"/>
</symbol>
<!-- 引用上面的定义 -->
<circle cx="50" cy="50" r="30" fill="url(#g1)"/>
<use x="110" y="0" xlink:href="#r1" stroke="orange" stroke-width="5" />
<path d="M240,20 C180,40 360,50 320,80" stroke="grey" marker-end="url(#arrow)" fill="none" stroke-width="2" />
<!-- marker-mid -->
<path d="M260,20 H300 V60" stroke="grey" marker-end="url(#arrow)" fill="none" stroke-width="1" marker-mid="url(#arrow)"/>
```

{% raw %}
<svg style="width:400px;height:100px;box-shadow:0 0 8px 0 rgba(0,0,0,.2);border:1px solid rgba(0,0,0,.1);">
  <defs>
    <linearGradient id="g1">
      <stop offset="20%" stop-color="#3D9" />
      <stop offset="90%" stop-color="#39F" />
    </linearGradient>
    <!--  W|H * markerUnits 计算实际大小 -->
    <marker viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth" id="arrow">
      <path d="M0,0 L0,6 L9,3 Z" fill="#3A9"></path>
    </marker>
  </defs>
  <symbol>
    <circle cx="50" cy="50" r="20" stroke-width="18" stroke="orange" fill="purple" id="r1"/>
  </symbol>
  <circle cx="50" cy="50" r="30" fill="url(#g1)"/>
  <use x="110" y="0" xlink:href="#r1" stroke="orange" stroke-width="5" />
  <path d="M240,20 C180,40 360,50 320,80" stroke="grey" marker-end="url(#arrow)" fill="none" stroke-width="2" />
  <path d="M260,20 H300 V60" stroke="grey" marker-end="url(#arrow)" fill="none" stroke-width="1" marker-mid="url(#arrow)"/>
</svg>
{% endraw %}

# 3.踩坑记

## 3.1 一个兼容SVG和IE的样式类操作（删／增）的工具函数

```js
/**
 * SVG元素的增/删样式类工具函数
 * IE不支持DOMElement.classList,以及jQuery.add/removeClass不支持SVG
 * @param element
 * @param className
 * @param opt 'add' | 'remove'
 */
function svgElementClassTool(element, className, opt) {
  var oldClassList =
    typeof element.getAttribute("class") !== "string"
      ? []
      : element.getAttribute("class").split(" ");
  if (opt === "add") {
    if (oldClassList.indexOf(className) < 0) {
      oldClassList.push(className);
      element.setAttribute("class", oldClassList.join(" "));
    }
  } else if (opt === "remove") {
    var removeIdx;
    for (var i = 0; i < oldClassList.length; i++) {
      if (oldClassList[i] === className) {
        removeIdx = i;
        break;
      }
    }
    removeIdx > -1 && oldClassList.splice(removeIdx, 1);
    element.setAttribute("class", oldClassList.join(" "));
  }
}
```

## 3.2 svg内可编辑文本

原本以为下面几行代码就搞定收工了，结果又一次忘记了**兼容**。
```html
<svg width="300" height="100" style="padding:10px;box-shadow: 0 0 8px 0 rgba(0,0,0,.2);">
  <foreignObject width="100" height="150">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <input value="hi~input.">
      <textarea>hi~textarea.</textarea>
    </div>
  </foreignObject>
</svg>
```

效果（IE不可见^_^）：

{% raw %}
<svg width="300" height="100" style="padding:10px;box-shadow: 0 0 8px 0 rgba(0,0,0,.2);">
  <foreignObject width="100" height="150">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <input value="hi~input.">
      <textarea>hi~textarea.</textarea>
    </div>
  </foreignObject>
</svg>
{% endraw %}

又是傲娇的IE不支持`<foreignObject>`。最终怎么解决的呢：在`<svg>`标签外，用绝对定位并与svg内元素保持交互同步。（感觉又给自己挖下了一个很深的坑呢— —||）。

## 3.3 使用`ng-repeat`遇到的删除元素但样式仍被保留问题

代码中使用了`ng-repeat`来将一组元素映射为dom，但是在交互中遇到如果删除了repeat中的元素，原来解析出来的dom如果有新设置的样式或类，会保留下来，所以很诡异的现象：明明从页面上删除了某个元素，但是它的样式却传递给了上一个元素，如果各个元素样式都不同，那么会出现样式错乱。

解决：样式与元素一一对应，而不是依赖元素位置。或者删除元素前先恢复该元素的样式到默认样式。

## 3.4 线条太细，hover太难触发

这个其实不算是坑，只是个小solution罢了，思路就是放置一条比较粗的重叠线，描边颜色是透明的就行。下面的例子为了说明，有效`hover`区域给成了`20px`，实际自己取舍。

```html
<svg style="width:400px;height:100px;box-shadow:0 0 8px 0 rgba(0,0,0,.2);border:1px solid rgba(0,0,0,.1);">
<style>
.line-group:hover .true-line { stroke: #C93; stroke-width: 4px; }
.line:hover { stroke: #C93; }
</style>
<text x="30" y="30">设置了hover范围的线</text>
  <g class="line-group">
    <path class="true-line" d="M50,50 h100" stroke="#39C" fill="none" stroke-width="2"></path>
    <path d="M50,50 h100" stroke="rgba(0,0,0,0)" fill="none" stroke-width="20"></path>
  </g>
  <text x="220" y="30">普通的线</text>
  <path class="line" d="M200,50 h100" stroke="#39C" fill="none" stroke-width="2"></path>
</svg>
```

效果如下：
{% raw %}
<svg style="width:400px;height:100px;box-shadow:0 0 8px 0 rgba(0,0,0,.2);border:1px solid rgba(0,0,0,.1);">
<style>
.line-group:hover .true-line { stroke: #C93; stroke-width: 4px; }
.line:hover { stroke: #C93; }
</style>
<text x="30" y="30">设置了hover范围的线</text>
  <g class="line-group">
    <path class="true-line" d="M50,50 h100" stroke="#39C" fill="none" stroke-width="2"></path>
    <path d="M50,50 h100" stroke="rgba(0,0,0,0)" fill="none" stroke-width="20"></path>
  </g>
  <text x="220" y="30">普通的线</text>
  <path class="line" d="M200,50 h100" stroke="#39C" fill="none" stroke-width="2"></path>
</svg>
{% endraw %}

# 4. SVG库

一开始没有选择d3.js库，而是手动撸原生，很失误。

* [D3.js](https://d3js.org/)
* [SVG.js](http://svgjs.com/)

