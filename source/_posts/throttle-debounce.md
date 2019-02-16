---
title: 节流和去抖
date: 2018-04-12 10:28:09
categories:
- 前端
tags:
- 性能优化
- UX
---

想象一下，你在滚动事件里有操作DOM，那么在你快速滚动页面时，会出现什么情况？是的，页面卡甚至崩了。因为滚动事件触发频率太高，而操作DOM又会导致重排、重绘这些大量消耗资源的任务发生。所以，我们要限制事件的频率（确切的说，时限制事件处理的频率，因为事件触发是不可控的），这就是**节流**了。

<!--more-->
去抖说的是什么呢，比如一个提交按钮，你可能会因为手抖双击了一下，如果没有做任何限制，那么这个按钮绑定的事件会被触发两次，这应该不是你想要的结果。

上面两个问题，其实表象上是用户体验的问题，而本质是前端性能优化的问题。网上关于这两个概念的讲解有很多，实际上，节流就是采样，去抖就是检波，比如这个示例（改自CSS-trick，使用`Lodash`库的节流和去抖函数)：

{% raw %}
<p data-height="407" data-theme-id="dark" data-slug-hash="yKWRgx" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="Debounce & Throttle" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/yKWRgx/">Debounce & Throttle</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

# 1. 去抖

首先想法就是设置时间窗口，在它范围外的就认为是另一个事件而不是抖动了，如下代码：

```js
function debounce_v0(coreFunc, safeWin) {
    // reset
    if(coreFunc.active && coreFunc.ts && +new Date - coreFunc.ts > safeWin) {
        delete coreFunc.active;
        delete coreFunc.ts;
    }
    if(!coreFunc.ts) {
        coreFunc.ts = +new Date;
        coreFunc.active = true;
        coreFunc();
        return;
    }
    if(+new Date - coreFunc.ts < safeWin) {
        coreFunc.ts = +new Date;
    }
}
```

嗯……好像有点儿low，核心方法上多了两个属性不说，没法给核心方法传入参数，而且只能在事件（抖动）初次触发，不能在末尾触发（比如滚动到底部加载下一页这种场景就无法适用），我们参考一下广大网友的智慧，然后造出这么个版本：

```js
// 这个debounce支持立即触发（即不做防抖），以及设置在什么位置（抖动前还是抖动结束时，后者会有延迟）触发
// opt
//    .win: 去抖的时间窗，如果没有设置，默认不去抖
//    .pos: -1 / 1（或其它）分别指在事件（抖动）开始时触发或事件结束时触发
const debounce_v1 = (coreFunc, opt) => {
    let timeOutRef, ts, result, ctx, args;

    let timerFunc = function () {
        let last = +new Date - ts; // `ts` is set per every event
        if (last < opt.win && last >= 0) {
            timeOutRef = setTimeout(timerFunc, opt.win - last);
        } else {
            if (opt.pos !== -1) {
                result = coreFunc.apply(ctx, args);
            }
            timeOutRef = null; // 保证可以响应下一个抖动事件
        }
    };

    return function () {
        ctx = this, args = arguments;

        if (!opt || !opt.win || opt.win <= 0) {
            result = coreFunc.apply(ctx, args);
        } else {
            ts = +new Date;
            opt.pos = opt.pos || -1;
            if (opt.pos === -1 && !timeOutRef) {
                result = coreFunc.apply(ctx, args);
            }
            if(!timeOutRef) { // 当前抖动里不会再进入（没有设置为null）
                timeOutRef = setTimeout(timerFunc, opt.win);
            }
        }
        return result;
    }
}
```

看下效果：

{% raw %}
<p data-height="415" data-theme-id="dark" data-slug-hash="GxbmmN" data-default-tab="result" data-user="blurnull" data-embed-version="2" data-pen-title="Debounce & Throttle" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/GxbmmN/">Debounce & Throttle</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

# 2. 节流

鉴于去抖中的v0中的问题，我们直接使用`setTimeout`：

```js
const throttle = (coreFunc, interval) => {
    let inThrottle, result;
    return function () {
        const args = arguments, ctx = this;
        if (!inThrottle) {
            result = coreFunc.apply(ctx, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, interval);
        }
        return result;
    }
}
```

## `requestAnimationFrame`

实际上，对于操作DOM（或样式）的场景，节流可以选择使用 `requestAnimationFrame`（后面简称rAF），它和 `_.throttle(dosomething, 16)` 基本一致，除了rAF的启动/取消逻辑需要自己处理。

使用参考[这篇博文](http://jonge.club/2018/03/23/smooth-animation/#2-2-requestAnimationFrame%E6%98%AF%E4%BB%80%E4%B9%88)。

-----

# 参考

1. https://css-tricks.com/debouncing-throttling-explained-examples/