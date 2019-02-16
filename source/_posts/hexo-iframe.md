---
title: hexo嵌入在线代码演示（codepen、jsFiddle等）
date: 2017-10-21 16:54:44
tags:
- hexo
categories:
- 利器
---
# 1. hexo嵌入CodePen

在[codepen](https://codepen.io)页面右下角点击embed，复制iframe（或html）菜单下的代码到下面代码块的`EMBED`里即可。

```
{% raw %}
EMBED
{% endraw %}
```
**示例**

>示例中魔性动画来源[The Last Experience](https://codepen.io/ge1doot/pen/LkdOwj)，感谢原作者[Gerard Ferrandez](https://codepen.io/ge1doot/)分享。

{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="LkdOwj" data-default-tab="js,result" data-user="ge1doot" data-embed-version="2" data-pen-title="The Last Experience" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/ge1doot/pen/LkdOwj/">The Last Experience</a> by Gerard Ferrandez (<a href="https://codepen.io/ge1doot">@ge1doot</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
{% endraw %}
<!-- more -->
# 2. hexo嵌入jsFiddle

hexo直接支持jsfiddle，所以如果有这么个代码片段`https://jsfiddle.net/5zyvfgav/`，那么直接嵌入到如下模板中（用`5zyvfgav`替换`shorttag`）：

```
{% jsfiddle shorttag [tabs] [skin] [width] [height] %}

```
结果如下：
{% jsfiddle 5zyvfgav dark %}
当然，你也可以用`raw`来嵌入：
{% raw %}
<script async src="//jsfiddle.net/5zyvfgav/embed/js,html,css,result/dark/"></script>
{% endraw %}

# 3.参考
[hexo DOC -tag plugins](https://hexo.io/docs/tag-plugins.html)