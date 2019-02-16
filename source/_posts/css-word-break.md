---
title: css-word-break
date: 2017-12-12 21:44:18
categories:
- 前端
- CSS
tags:
- text
---

# 同样，先占坑

要求同时满足以下两点才会生效：
* 有宽度。（100%不算，注意inline元素转为inline-block设置的宽度才会有效）
* 同时设置`overflow:hidden`、`white-space: nowrap`、`text-overflow: ellipsis`。

```css
/* 或者也可以直接在有宽度的父元素中指定 */
.span-wrapper{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

-----
## 参考

[MDN CSS text-overflow](https://developer.mozilla.org/en/docs/Web/CSS/text-overflow?v=example)