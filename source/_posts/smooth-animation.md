---
title: 前端性能优化（一、页面卡顿问题）
date: 2018-03-23 23:19:52
categories:
- 前端
tags:
- 性能优化
- requestAnimationFrame
- Web Worker
---

*本文主要针对性能优化中，页面交互上（拖拽、滚动等）的卡顿问题。*

# 1. 为何出现卡顿

一般来讲，60FPS（60帧/秒）对人类是最佳体验，那么换算成一帧需要的秒数，就是`16.7ms`，如果高于这个时间，就可能会出现画面跳跃感（即卡顿），关于FPS和人眼以及同样FPS的电影与游戏的区别参考文末*知乎问答链接*。
<!--more-->
**注意**：这里一秒60帧，说的是均匀的，不是前半秒59帧，后半秒1帧，这样的看起来依然会卡，即流畅需要*帧间隔*是稳定的。

|FPS|ms/帧|
|----|----|
|`120`|`8.3`|
|`60`|`16.7`|
|`30`|`33.3`|
|`24`|`41.7`|

# 2. 实例分析

演示代码获取：[点击这里](https://github.com/NoName4Me/blog/tree/master/source/_posts/smooth-animation/code)。

## 2.1 利用Chrome DevTool的`Performance`分析问题

那么在实际开发中，我们如何进行调优？下面通过Chrome DevTool下的`Performance`中的功能进行演示：

进入该页签后，点击左上角录制按钮（或`Ctrl+E`）进行录制，然后操作页面，记录需要分析的交互，点击`stop`完成录制，下面进行分析。

在顶部的图标里，从上到下依次为FPS、CPU、NET的表现，我们关注FPS，如果出现红色，说明一秒的帧数过少，有卡顿，红色下面绿色代表FPS，越高说明性能越好。

<img src="https://raw.githubusercontent.com/NoName4Me/blog/master/source/_posts/smooth-animation/performance.png" width=560>

如果录制时间较长，我们可以点击具体有问题的部分深入分析，图中Main（第2个蓝色框里）中显示了具体的事件，可以看到耗时的地方出在了JS的处理中（黄色是脚本耗时，紫色是渲染耗时），从上到下为JS的调用栈（图中可以看到问题出在了`mousemove`事件中调用某个函数时），我们选中最下面的（源头），查看图中第3个蓝框里的内容，点击`script.js`进入到具体代码执行分析，其它tab里的东西感兴趣可以自己了解。

代码执行耗时分析如下，可以看到是这个`delay()`函数比较耗时引起的，这里只是为了示例所以用了循环来主动耗时，实际开发中什么神奇的代码都会有，具体问题具体分析。

<img src="https://raw.githubusercontent.com/NoName4Me/blog/master/source/_posts/smooth-animation/code-analyze.png" width=480>

这种在频繁需要更新页面的事件里，大规模并不直接相关的计算应该避免或异步处理。

* 一个看来起来暂时貌似没什么卵用的东西

`Ctrl+Shift+P`输入`rendering`，选择`Showing Rendering`，勾选`FPS Meter`，会看到右上角的实时FPS等参数，取消勾选`FPS Meter`，按下`ESC`退出`Show Rendering`。

## 2.2 `requestAnimationFrame`是什么

**注**：后面RAF为requestAnimationFrame的简写。

在一些动画中，我们需要定时去更新页面，来展示不同的信息，一般会采用`setTimeout`、`setInterval`，但可能会因为回调触发时间在帧末尾，从而出现丢帧导致的卡顿现象，而RAF可以保证你的JS代码在每帧帧首执行。

比如，下面的进度展示，在`2000ms`内随着每一帧更新元素位置。

```js
var start = null;
var element = document.getElementById('SomeElementYouWantToAnimate');
element.style.position = 'absolute';
element.style.width = '100px';
element.style.height = '40px';
element.style.background = 'red';

function step(timestamp) { // timestamp是RAF默认的传给handler的入参，由performance.now()生成
  if (!start) start = timestamp;
  var progress = timestamp - start;
  element.style.left = Math.min(progress / 10, 200) + 'px';
  if (progress < 2000) {
    window.requestAnimationFrame(step); // 这里如果没有执行就不会再触发step()
  }
}

window.requestAnimationFrame(step);
```

## 2.3 三个原则

### 2.3.1 避免耗时的事件handler

一般的事件处理是在页面的合成器线程中进行，不会触发主线程处理：

<img width=480 src="https://developers.google.com/web/fundamentals/performance/rendering/images/debounce-your-input-handlers/compositor-scroll.jpg">

而如果，你给事件绑定了handler（比如下图中的`onTouchMove`），那么页面合成器线程就会一直等待handler完成，这样就会阻塞合成器进行后续的动作：

<img width=480 src="https://developers.google.com/web/fundamentals/performance/rendering/images/debounce-your-input-handlers/ontouchmove.jpg">

所以呢，要保证你的handler执行速度。

### 2.3.2 避免过度的RAF

关于RAF，W3C上有这么一段*Note*：

> Also note that multiple calls to requestAnimationFrame with the same callback (before callbacks are invoked and the list is cleared) will result in multiple entries being in the list with that same callback, and thus will result in that callback being invoked more than once for the animation frame.
> 
> — [w3c: Timing control for script-based animations](https://www.w3.org/TR/animation-timing/#dom-windowanimationtiming-requestanimationframe)

一个RAF在事件handler里，如果事件触发的非常快速（小于一帧的周期），那么就会出现上面的情况——多次RAF了同一个回调，这样在一帧中会多次激活回调函数，可以在handler里增加标志量来判别：

```js
const onScroll = e => {
    if (scheduledAnimationFrame) { return }

    scheduledAnimationFrame = true
    window.requestAnimationFrame(timestamp => {
        scheduledAnimationFrame = false
        animation(timestamp)
    })
}
window.addEventListener('scroll', onScroll)

```

### 2.3.3 避免在事件handler里修改样式

我们知道，一帧的输出是经过这么些步骤的：

<img src="https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/frame.jpg">

首先JS运行，然后计算样式，然后布局。但是，可以使用JS强制浏览器提前执行布局，这被称为强制同步布局：

事件会在RAF回调执行前触发，如果在事件中进行了某个元素的样式改动，在RAF前，这些改动会挂起，如果在RAF回调中又读取元素样式，这样就会导致强制同步布局（如下图），这种事情应该被避免（比如**可以提前保存要读取的值，后面使用该保存值，而不是直接读取元素样式**），因为它打乱了正常的60FPS触发套路（如上图）。

<img src="https://developers.google.com/web/fundamentals/performance/rendering/images/debounce-your-input-handlers/frame-with-input.jpg">

```js
function onScroll (evt) {

  // Store the scroll value for laterz.
  lastScrollY = window.scrollY; // 2.3.3原则

  // Prevent multiple rAF callbacks.
  if (scheduledAnimationFrame) // 2.3.2原则
    return;

  scheduledAnimationFrame = true;
  requestAnimationFrame(readAndUpdatePage);
}

window.addEventListener('scroll', onScroll);
```

## 2.4 `Web Worker`和微任务

> 了解更多关于[Web Worker](http://jonge.club/2018/05/09/web-worker/)。

当一些耗时的JS处理与样式计算、布局在一起时，会阻塞它们对界面的及时更新，此时如果那些JS处理并不关注DOM，可以放到`Web Worker`里（如下示例），但是注意，`Web Worker`没有DOM访问权限。

```js
var dataSortWorker = new Worker("sort-worker.js");
dataSortWorker.postMesssage(dataToSort);

// The main thread is now free to continue working on other things...

dataSortWorker.addEventListener('message', function(evt) {
   var sortedData = evt.data;
   // Update data on screen...
});
```

但是很多时候，我们时需要在主线程上运行我们的任务，此时，可以考虑将大任务分割成微任务，通过`requestAnimationFrame`来处理：

```js
var taskList = breakBigTaskIntoMicroTasks(monsterTaskList);
requestAnimationFrame(processTaskList);

function processTaskList(taskStartTime) {
  var taskFinishTime;

  do {
    // Assume the next task is pushed onto a stack.
    var nextTask = taskList.pop();

    // Process nextTask.
    processTask(nextTask);

    // Go again if there’s enough time to do the next task.
    taskFinishTime = window.performance.now();
  } while (taskFinishTime - taskStartTime < 3);

  if (taskList.length > 0)
    requestAnimationFrame(processTaskList);
}
```

--------

# 参考

1. [Google Web Developer #Analyze Runtime Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/)
2. [知乎问答：是不是游戏帧数一般要到 60 帧每秒才流畅，而过去的大部分电影帧数只有 24 帧每秒却没有不流畅感？](https://www.zhihu.com/question/21081976/answer/34748080)
3. [知乎问答：人眼帧数是否不能高于 30 ，李安 120 帧的电影是否没有意义？](https://www.zhihu.com/question/52397668)