---
title: Web Worker
date: 2018-05-09 20:21:16
categories:
- 前端
- JS
tags:
- web worker
---

Web Worker 实际上没有打破 JS 的单线程特性，它不过是浏览器赋能的 API 而已，即 Worker 线程是浏览器提供的。主要有以下几种：

<!--more-->
* 专用 Worker（**本文涉及**）
* 共享 Worker：不同 iframe 或 window 之间共享。
* 服务 Worker：PWA 里常用。
* 音频 Worker：专门用于处理音频。
* Chrome Worker：

# 1. 基本使用

> 通过构造器 `Worker` 生成的可以运行在 Worker 线程的对象。它和主线程的通信借助消息系统完成：`onmessage` 监听消息 和 `postMessgae` 发送消息。

```js
// main.js
let worker = new Worker('work.js')

worker.onmessage = function(msg) {
    console.log('in main.js: %o', msg.data);
    // 结束 worker
    worker.teminate();
}

worker.postMessage();


// work.js
// 它有自己的上下文
onmessage = function(msg) {
    console.log('in worker defined by file: %o', msg.data);
}

// 当然还可以继续发送消息
postMessage();

// 结束 worker
// close();
```

**这里强调一下**：主线程和 worker 之间的数据传递是复制的不是引用的。对象在传递给 worker 时会被序列化。


Navigator
XMLHttpRequest
Array, Date, Math, and String
WindowTimers.setTimeout and WindowTimers.setInterval

# 2. 高级操作

## 2.1 给 Worker 传递函数

## 2.2 非文件形式定义 Worker

通过设置一个 `script` 标签，在 JS 中使用该标签下定义的代码来初始化 Worker：

```html
<script type="text/js-worker">
  onmessage = function(msg) {
    console.log('in worker defined by <script>: %o', msg.data);
  };
</script>
```

```js
var blob = new Blob(Array.prototype.map.call(document.querySelectorAll('script[type=\'text\/js-worker\']'), function (oScript) { return oScript.textContent; }),{type: 'text/javascript'});

// Creating a new document.worker property containing all our "text/js-worker" scripts.
document.worker = new Worker(window.URL.createObjectURL(blob));

document.worker.onmessage = function(oEvent) {
pageLog('Received: ' + oEvent.data);
};
```

使用Blob的话，你还可以这样子不使用文件来传入 Worker 内容：

```js
function fn2workerURL(fn) {
  var blob = new Blob(['('+fn.toString()+')()'], {type: 'application/javascript'})
  return URL.createObjectURL(blob)
}

function workerFn() {
    onmessage = function(msg) {
        console.log('in worker defined by function: %o', msg.data);
    }
}

var worker = new Worker(fn2workerURL(workerFn))
```



------

# 参考

1. Using Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
2. 