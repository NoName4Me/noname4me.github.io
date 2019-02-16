---
title: 同源和跨域
date: 2018-04-10 00:09:01
categories:
- 前端
tags:
- 跨域
---

跨域是前端和后端一起促成的，不过一般我们看到的很多问题都是前端限制（浏览器的同源策略）导致的错误（可以从开发者模式下看到请求后端是成功返回的，只是浏览器拦截了它，并抛出了异常）。
<!--more-->
本文涉及源码归档[点击这里](https://github.com/NoName4Me/cross-origin-demo)。

# 1. 同源策略和规避方法

## 1.1 同源策略

**同源**的意思是下面三个都相同：

* 协议
* 域名（包括子域名），比如 `sub.baidu.com` 和 `baidu.com`
* 端口

如果非同源，那么这三种行为会受限：

* Cookie、LocalStorage 和 IndexDB 无法读取。
* DOM 无法获得。
* AJAX 请求不能发送。

## 1.2 规避方法

### 1.2.1 JSONP

几本思路就是利用`script`标签获取到的内容会被自动执行的特性，请求时说明回调函数名，服务器直接返回该函数的调用（并填入参数），代码如下：

```js
// 客户端
function addScript(src) {
    var script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}

window.onload = function () {
    addScript('http://target.site/dir?callback=sayHi');
};

function sayHi(data) {
    document.querySelector('#msg').innerText = 'Hi~' + data.name;
}

// 服务器返回
sayHi({name:'Jonge'});
```

### 1.2.2 跨文档通信 `postMessage()`

【MDN简单搬运】

1. 发送

`targetWindow.postMessage(message, targetOrigin, [transfer])`

* `targetWindow`：目标窗
    - `Window.open`：新打开窗口的引用
    - `Window.opener`：打开当前窗口的窗口（父窗口）
    - `HTMLIFrameElement.contentWindow`：从父窗口访问 `<iframe>`
    - `Window.parent`：在 `<iframe>` 里访问父窗口
    - `Window.frames` + 索引值（数字或名称）
* `message`：传递的消息
* `targetOrigin`：目标origin，`'*'`表示所有

2. 监听

```js
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  if (event.origin !== "http://example.org:8080")
    return;
}

// event.data：消息
// event.origin：消息发出者的origin（比如http://father.com）
// event.source：消息发出者的引用
```

### 1.2.3 CORS（跨域资源共享）

* Client 请求头部加：`Origin: xxxx`（这个头一般在访问控制请求里默认会添加，比如`XMLHttpRequest`或`Fetch API`）
* Server 返回头部加：`Access-Control-Allow-Origin: xxxx`

[更多关于CORS参考MDN文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)。

-------

# 参考

1. Same Origin - wiki：https://en.wikipedia.org/wiki/Same-origin_policy
2. 浏览器同源政策及其规避方法·阮一峰：http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html