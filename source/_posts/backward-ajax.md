---
title: 反向Ajax（手机扫码，PC端自动登陆并跳转）
date: 2018-04-10 22:23:47
categories:
- 前端
- JS
tags:
- 反向Ajax
- long polling
---

在电脑上登陆某个网站时，有时会选择用手机扫码登陆，那么电脑上是怎么做到手机扫码后自动跳转的呢？
<!--more-->
一般想到的就是定时轮询（不到万不得已最好不要这样），然后时websocket（服务器通知），其实还有一种方式—— `long polling`（长时请求）。其实后面都可以归为反向Ajax，即服务器来通知浏览器。

# 1. 一些反向Ajax技术

## 1.1 HTTP轮询和JSONP轮询

HTTP轮询就是简单的定时请求服务器，为了保证客户端状态更新及时，需要设置比较小的轮询间隔，这样又会带来性能的问题，且不说浪费那么多次请求流量，JSONP和它一样，除了JSONP支持跨域（只支持`GET`方法）。

## 1.2 长轮询

基本思路就是，让某个请求的超时时间比较大，然后服务器这边hold住这个请求，直到对应的事件被触发，然后处理那个请求。

```js
//            request_1: hi ~
// Client  -----------------------> Server
//                                    | hold ...
//           request_2: finish r1
// Client  -----------------------> Server : deal with the 'hi~' (long polling)
//   \-> can be other client              |
//                                        |
//             response_2: ok             V
//         <-----------------------  Server
//                                        |
//             response_1                 V
// Client  <-----------------------  Server
```

## 1.3 WebSocket

> // TODO

# 2. 超简易模拟扫码登录

思路：

* 服务器针对PC的登陆请求生成一个唯一识别码，并将此识别码编入到二维码中返回给PC这边的浏览器（以及一段自运行的启动长轮询的脚本）；
* PC上浏览器收到返回，呈现二维码，发起长轮询，服务器将此长轮询根据唯一识别码存储起来，并且hold住它；
* 打开微信扫一扫（此处，假设手机端是登陆状态，PC上这个二维码实际上是一个请求，附带上了唯一识别码），发起请求（这里根据具体业务选择带上登陆信息）；
* 服务器根据手机扫码请求带过来的唯一识别码（和登陆信息，可能要进行一些登陆身份验证什么的），处理前面存储的长轮询；
* PC上浏览器请求（长轮询）被处理，根据返回的数据进行相应跳转。

DEMO源码获取[点击这里](https://github.com/NoName4Me/phone-scan-qrcode-pc-login-demo)。

--------

# 参考

1. 实现手机扫描二维码页面登录，类似web微信：https://blog.csdn.net/otangba/article/details/8247594
2. QR Code Generator：https://github.com/soldair/node-qrcode
3. Fetch：https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch