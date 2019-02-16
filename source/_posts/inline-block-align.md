---
title: inline-block-align
date: 2017-12-12 21:34:19
categories:
- 前端
- CSS
tags:
- inline
- block
- 元素对齐
---

# 先占坑，后面补写

首先span是inline元素，不能直接在CSS中设置宽高。

1、同行对齐，两者同时设置`vertical-align: middle`，取值视具体需求。
*注意： vertical-align对block元素无作用。*

2、多行文字，图片居于首行（即文字环绕效果）
默认情况下就会环绕，但是如果span被置为inline-block且没有设置width，span元素会另起一行。

3、将2中的组合垂直居中
使用table或者float来实现。
[JsFidder示例](https://jsfiddle.net/jonge/250uua1z/)


# span比其同级的img略高

因为img是inline元素，默认baseline对齐（vertical-align: baseline;）。

![img](https://static.oschina.net/uploads/space/2017/0411/160733_Wla4_3409026.png)

* 解决方式

```css
img {
  display: block;
  /* 或 vertical-align: bottom; */
}
```

* 顺带一提

vertical-align只适用于inline级别的元素。


----
## 参考
[MDN doc: Images, Tables and Mysterious Gaps](https://developer.mozilla.org/en-US/docs/Images,_Tables,_and_Mysterious_Gaps)
