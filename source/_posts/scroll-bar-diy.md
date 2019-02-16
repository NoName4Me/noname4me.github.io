---
title: 自定义浏览器滚动条
date: 2018-02-23 23:14:38
categories:
- 前端
tags:
- 滚动条
- 事件
---

>这篇文章主要讲如何自定义网页滚动条。

webkit内核的浏览器支持使用CSS自定义滚动条，IE仅支持颜色修改，火狐完全不支持，如果要兼容各个浏览器，要么借助三方插件（见文末列举），要么通过js和css等手段自己实现。

```js
// TODO
// 1. js+css滚动到底部后无法触发外部容器的滚动
// 2. 封装Angular组件（待优化）
// 3. 可选：jQuery实现（使用mCustomScrollbar）
```

<!--more-->

# 1. 自己实现

先看效果：

{% raw %}
<p data-height="415" data-theme-id="dark" data-slug-hash="GQrpNQ" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="js-scroll" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/GQrpNQ/">js-scroll</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

angularjs组件化参考[这里](#)。

## 1.1 CSS方式

**只对webkit内核浏览器（如chrome）有效**，代码如下（详细控制样式参考[Webkit-Style-Scrollbar](https://webkit.org/blog/363/styling-scrollbars/)）：

假设滚动元素有一个CSS样式类`webkit-style`：

```css
/* 滚动条宽度（粗细更好理解，对于水平／垂直） */
.webkit-style::-webkit-scrollbar {
    width: 8px;
}

/* 滑轨样式 */
.webkit-style::-webkit-scrollbar-track {
    border-radius: 4px;
    box-shadow: inset 0 0 6px 0 rgb(227, 196, 252);
}

/* 滑块样式 */
.webkit-style::-webkit-scrollbar-thumb {
    background-color: #b55ffc;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .3);
    border-radius: 4px;
}

.webkit-style::-webkit-scrollbar-thumb:hover {
    background-color: #a239f9;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .4);
    border-radius: 4px;
}

/* 滑轨两头的按钮（比如垂直滚动条的两端：上／下箭头按钮） */
.webkit-style::-webkit-scrollbar-button {
    background-color: #666;
}

/* 横向和纵向滚动条相交处样式 */
.webkit-style::-webkit-scrollbar-corner {
    background-color: black;
}
```

## 1.2 JS和CSS跨浏览器方式

其实只要做出和滚动相同的效果来就可以了，即：鼠标滚轮滚动、拖拽滑块都可以控制内容的滚动。

首先，设置要滚动内容的样式：
```css
.content {
    /* 其它样式 */
    overflow: hidden;
}
```

然后，做一个自己中意的滚动条：

页面结构：

```html
<div class="scroll-container">
    <div class="scroll">
        <div class="bar"></div>
    </div>
    <div class="content"></div>
</div>
```

样式：

```css
.scroll-container .scroll {
    position: absolute;
    right: 0;
    top: 0;
    width: 8px;
    background-color: #fff;
    box-shadow: inset 0 0 6px 1px rgb(155, 238, 255);
    height: 100px;
    border-radius: 4px;
}

.scroll-container .scroll .bar {
    position: absolute;
    right: 0;
    top: 0;
    background-color: #18c0e2;
    width: 8px;
    height: 60px;/* 不要在意这个，只是为了看样式，后面在JS里会自动计算滑块长度 */
    border-radius: 4px;
}
```

最后，增加模拟滚动逻辑：

```js
var initPos = {
        x: 0,
        y: 0
    },
    scrollBar = document.querySelector(".scroll-container .bar"),
    scrollContent = document.querySelector(".scroll-container .content"),
    barHeight,
    scrolledHeight = 0,
    sampleRatio = 2; // TODO how to set the best sample ratio

function clearTextSelection() {
    if (document.selection) {
        document.selection.empty();
    } else {
        window.getSelection().removeAllRanges();
    }
}

function setScrollBarHeight() {
    var barRatio = scrollContent.clientHeight / scrollContent.scrollHeight;
    barHeight = barRatio * scrollContent.clientHeight;
    scrollBar.style.height = barHeight + "px";
}

function onMouseMove(moveEvent) {
    clearTextSelection();
    setScrollBarHeight();

    var deltaY = restrictScrollDelta(moveEvent.clientY - initPos.y);
    doScrollY(deltaY);
}
function restrictScrollDelta(deltaY) {
    if (deltaY < 0) {
        deltaY = 0;
    }

    if (deltaY > scrollContent.clientHeight - barHeight) {
        deltaY = scrollContent.clientHeight - barHeight;
    }
    return deltaY;
}
function doScrollY(deltaY) {
    scrollBar.style.top = deltaY + "px";
    scrollContent.scrollTop = deltaY;
}
function onMouseUp(upEvent) {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

function barMousedown(event) {
    initPos.y = event.clientY;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}

// mousedown event for bar-dragging event
scrollBar.addEventListener("mousedown", barMousedown);

// scroll is triggered only when it can be scrolled
scrollContent.addEventListener("wheel", function(event) {
    scrolledHeight += event.deltaY / sampleRatio;
    scrolledHeight = restrictScrollDelta(scrolledHeight);
    doScrollY(scrolledHeight);
    event.preventDefault();
    event.stopPropagation();
    return false;
});

// set init bar height
setScrollBarHeight();
```


# 2. 三方插件

1. [malihu-custom-scrollbar-plugin](https://github.com/malihu/malihu-custom-scrollbar-plugin)
2. [jScrollPane](https://github.com/vitch/jScrollPane)
3. [smoothscroll-for-websites](https://github.com/galambalazs/smoothscroll-for-websites)