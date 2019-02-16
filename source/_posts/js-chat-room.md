---
title:  JS chat room项目练习总结
date: 2017-12-12 20:36:18
categories:
- 项目总结
tags:
- koa
- node
- websockets
- vue
---

>主要参考：[廖雪峰的JS全栈教程](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000)。

练习项目归档：[chat-room(Github)](https://github.com/NoName4Me/FE-basic-practice/tree/master/2.chat-room)。

![img](https://raw.githubusercontent.com/NoName4Me/web-practice/master/2.chat-room/static/images/chat-room.png)

# 1 整体架构
## 前端
* 呈现在Web页面上，提供用户列表，展示、发送聊天面板。
* 登录、注册面板。
* 在收到服务器消息后局部更新页面内容。

## 后端：
* 服务器收到用户登录信息，刷新数据库状态，并将所有用户列表发送给当前登录用户，并广播该用户信息到其它用户。
* 服务器收到用户发送的消息，广播给所有用户。


<!--more-->

# 2 知识点
## 2.1 Node.js
>Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.

基本用法：
```js
var http = require('http');

http.createServer(function(request, response) {
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];
  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    // At this point, we have the headers, method, url and body, and can now
    // do whatever we need to in order to respond to this request.
  });
}).listen(8080); // Activates this server, listening on port 8080.
```

但是这种原生的写起来比较繁重，所以可以考虑一些成熟的开发框架，比如Koa。

## 2.2. Koa

>koa 是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件，它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。

### 2.2.1 基本用法
```js
onst Koa = require('koa');
const app = new Koa();

// x-response-time
app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  // next会暂停此函数的运行，将控制权交给一下个函数比如这里的logger（），（如果下个函数里没有再次出发next）然后继续从这里执行，await的意思是等待直到返回。
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// error handle
app.on('error', (err, ctx) =>
  log.error('server error', err, ctx)
);

// response
app.use(ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000); // i.e. http.createServer(app.callback()).listen(3000);
```
### 2.2.2 常用方法
* `ctx.req` / `ctx.res`

node的request/response。Koa的request和response分别为ctx.request、ctx.response，而Koa中可以简写，如`ctx.header`就是`ctx.request.header`。

* `ctx.state`

向前端传递数据。
`ctx.state.user = await User.find(id);`

### 2.2.3 中间件

`app.use(function)`
常用的如koa-bodyparser、koa-rooter等，了解更多[Koa Middleware](https://github.com/koajs/koa/wiki#middleware)。

## 2.3 Nunjucks

它是一种更偏向于后端的模板引擎（比如输出网页），但是不比那些如React.js、Vue.js等前端框架在更前端的表现能力。

基本用法：
```js
const nunjucks = require('nunjucks');
var res = nunjucks.render('foo.html', { username: 'James' });

nunjucks.render('async.html', function(err, res) {
});
```
官方手册[Nunjucks](http://mozilla.github.io/nunjucks/api.html)。

## 2.4 Sequelize

一个基于Promise机制的ORM。

```js
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: 'path/to/database.sqlite'
});

var User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync().then(function() {
  return User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  });
}).then(function(jane) {
  console.log(jane.get({
    plain: true
  }));
});
```

官方手册[Sequelize](http://docs.sequelizejs.com/en/v3/)。

## 2.5 Websocket

它只是一个协议，和什么语言没有任何关系。是一种持久化（全双工）通信的协议，与HTTP有交集但不一样。

### 2.5.1 基本原理

以下内容摘自知乎[WebSocket 是什么原理？为什么可以实现持久连接？](https://www.zhihu.com/question/20215561/answer/40316953)，版权归原作们所有。

Websocket是基于HTTP协议的，它的前期握手一部分就是HTTP协议握手。

```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```
它比一般的HTTP握手协议中多了

```
Upgrade: websocket
Connection: Upgrade
```

服务器响应：
```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```
然后就可以互通有无了。

它主要解决了（当想要全双工通信时）使用HTTP协议中的无状态、被动式的通信方式，减少了每次通信都要重新建立连接从而耗费资源的问题。

ps：引用结束。


### 2.5.2 ws用法
Node中有实现了Websocket的包，通过`npm install ws`安装。

```js
// 服务器
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});


// 客户端
const WebSocket = require('ws');

const ws = new WebSocket('ws://www.host.com/path');

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(data, flags) {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
});

```
[Github地址](https://github.com/websockets/ws)。

## 2.6 Vue.js

>Vue.js（读音 /vjuː/，类似于 view） 是一套构建用户界面的渐进式框架。与其他重量级框架不同的是，Vue 采用自底向上增量开发的设计。Vue 的核心库只关注视图层，它不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与单文件组件和 Vue 生态系统支持的库结合使用时，Vue 也完全能够为复杂的单页应用程序提供驱动。

```html
// HTML
<div id="app">
  {{ message }}
</div>

// js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```
*注意：* Vue.js的{% raw %}{{..}}{% endraw %}</code>会和其它模板框架（比如Nunjucks）有冲突，所以当必须要使用两种框架时，可以通过`v-text=""`来规避。

以上。
