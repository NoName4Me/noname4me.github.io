---
title: Web缓存之浏览器缓存（HTTP缓存）
date: 2018-04-05 16:29:29
categories:
- 前端
tags:
- 性能
- 缓存
---

Web缓存这个题相当大，而浏览器这部分的缓存涉及的也不少： HTTP 缓存、cookie、localStorage，我们一点点来，先从 HTTP 缓存开始。

我就不另辟蹊径了，大体就两种：强缓存、协商缓存。**强缓存**意思就是浏览器这边自行判断是否过期而决定是否请求服务器，**协商缓存**意思就是要先去问问服务器咯。
<!--more-->
# 1. 强缓存

## 1.1 `Expires`

`Expires`是 HTTP/1.0 提出的，它的值是由服务器指定的GMT格式的绝对时间，表示该资源过期时间。使用过程如下：

* 首次请求，服务器的response头部有一条：`Expires:Fri, 6 Apr 2024 12:56:25 GMT`；
* 浏览器接收后，缓存**所有头部**和该资源；
* 如果再次需要请求该资源，浏览器先比对当前时间和`Expires`的时间，如果还没到期，就直接使用该缓存的**所有头部**和该资源；
* 否则，向服务器请求，新获取的资源和**所有头部**又被缓存（实际是更新原来缓存的）。

**注意：** `Expires`有个很重要的问题，如果服务器时间和客户端时间差异较大，那么缓存管理会出现问题，所以呢，HTTP/1.1 提出了的`Cache-Control`，比如服务器返回的头部为`Cache-Control:max-age=315360000`，我们下一节分析。

## 1.2 `Cache-Control`

`max-age`设置的是相对时间（单位：秒），使用流程与 `Expires` 类似，只是 `Cache-Control` 计算缓存时间是第一次请求的时间加上`max-age`的时间，然后和当前时间比对。

`Cache-Control`字段可以设置的不仅仅是`max-age`存储时间，还有其他额外的值可以填写，甚至可以组合。主要使用的值有如下：

* `s-maxage`: 同 `max-age`，覆盖 `max-age`、`Expires`，但仅适用于共享缓存，在私有缓存中被忽略。
* `public`: 表明响应可以被任何对象（发送请求的客户端、代理服务器等等）缓存。
* `private`: 表明响应只能被单个用户（可能是操作系统用户、浏览器用户）缓存，是非共享的，不能被代理服务器缓存，如`private, max-age=3600`。
* `no-cache`: 看词义是“不缓存”，实际上仍然对资源使用缓存，但每一次在使用缓存之前必须（MUST）向服务器对缓存资源进行验证。
* `no-store`: 不使用任何缓存，这个才是**真·不缓存**。
* `must-revalidate`: 如果你配置了 `max-age` 信息，当缓存资源仍然新鲜（小于 `max-age`）时使用缓存，否则需要对资源进行验证。所以 `must-revalidate` 可以和 `max-age` 组合使用`Cache-Control: must-revalidate, max-age=60`

**注意：**当`Expires`和`Cache-Control`都设置时，后者优先。

## 1.3 如何强制刷新强缓存

对于一些静态资源，设置长时间的强缓存，可以有效提升网页响应速度，但是当版本更新时，需要强制刷新缓存，或者在开发中强制刷新呢？

1. 浏览器强制刷新`ctrl + F5`，或者使用隐身模式（chrome)，活着在chrome的network面板里勾选disable cache。
2. 给资源添加动态参数，比如`xx/resource?v=1234`，活着资源名称动态修改`xx/resource_1234`，前端的构建工具都能做到，[点此了解](https://www.zhihu.com/question/20790576)前端工程化部署方向的演进。

# 2. 协商缓存

> 浏览器第一次请求数据之后会将数据和响应头部的缓存标识存储起来。再次请求时会带上存储的头部字段，服务器端验证是否可用。如果返回 304 Not Modified，代表资源没有发生改变可以使用缓存的数据，获取新的过期时间。反之返回 200 就相当于重新请求了一遍资源并替换旧资源。

## 2.1 `Last-modified` 和 `If-Modified-Since`

使用流程：

* 首次请求，服务器的返回资源，并有个头部`Last-modified:Tue, 05 Apr 2016 10:18:17 GMT`，标识资源的最后修改时间；
* 再次请求，请求带上头部`If-Modified-Since:Tue, 05 Apr 2016 10:18:17 GMT`；
* 服务器用该头部时间比对资源最后的修改时间，如果相同，则返回 `304 Not Modified`；
* 否则，返回新的资源，新的头部`Last-modified`，并设置状态码为200。

但是呢，依靠时间来比对，还是会出现意外，比如服务器时间被修改了什么的，某些服务器不能精确得到资源的最后修改时间，一些资源的修改时间变了但内容没有变等等问题，所以就有了用资源唯一标识符这种更强力（资源内容级别）的校验机制。

## 2.2 `ETag` 和 `If-None-Match`

使用流程：

* 首次请求，服务器返回资源，并使用某种算法（比如 MD5）计算出一个该资源的唯一标识，附加到头部里：`ETag:"570390e9-2d1"`；
* 再次请求，请求带上头部`If-None-Match:"570390e9-2d1`；
* 服务器使用相同算法计算该资源的标识符，比对`If-None-Match`的值，如果相同，则返回 `304 Not Modified`；
* 否则，返回新的资源，重新计算头部`ETag`，并设置状态码为200。

以上，具体选用哪种缓存机制，可以参考一下这个决策树：

<img src="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/images/http-cache-decision-tree.png" width=540>

------
# 参考

1. 知乎专栏：https://zhuanlan.zhihu.com/p/29750583
2. 知乎专栏：https://zhuanlan.zhihu.com/p/28113197
3. 《图解HTTP》上野宣
4. 流览器缓存知识小结及应用：http://www.cnblogs.com/lyzg/p/5125934.html