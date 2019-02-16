---
title: JS模版引擎（nunjucks）
date: 2018-03-25 01:00:09
categoried:
- 前端
- JS
tags:
- nunjucks
- template engine
---

*最近在做一个前端mock服务器的小工具（[点击这里了解](https://github.com/NoName4Me/light-mock-server)），在处理根据配置的数据生成mock文件时顺带学习了`nunjucks`，记录一下。*

`nunjacks`这个模版引擎，虽然它是用于生成HTML，但是，我们可以利用它的模板语法来生成自己的文件。

<!--more-->

# 1. nunjucks使用

## 1.1 引入，以及渲染

```js
const nunjucks = require('nunjucks');
const fs = require('fs');

var template = fs.readFileSync('./some.template').toString();
// 模板内容：Hello, {{ name }}~
let data = { name: 'jonge' };
var compiledData = nunjucks.renderString(template, data);

fs.writeFileSync('./test.js',compiledData);
// 生成文件内容：Hello, jonge~
```

## 1.2 两个小技巧

* 将对象展开到模板里

```js
var temp = {{ obj | dump(2) | safe}};
// obj 是要展开的对象
// dump作用等同于JSON.stringify
// safe意思时文本安全，无需编码（如不设置safe，则<被编码为&lt;等特殊字符被编码）

// 假设obj={name:'jonge'}，那么模板最终被渲染下面的内容（可能格式会稍乱）
var temp = {
    "name": "jonge"
};
```

* 迭代数组（或对象），末尾移除`,`

```js
[
{%- for item in list %}
    {key1: {{item.sth1}}, key2: {{item.sth2}}}{% if loop.index !== loop.length %},{% endif %}
{%- endfor %}
]
```

# 2. 常用指令简记

* `for` / `if`

```js
{% for list in lists %}
// lists可以是Array可以时Object
// for key,value in obj
// loop.index0代表当前索引
// loop.length代表迭代个数
// loop.last标志是否到最后一个
{% endor %}

{% if x === y %}
{% endif %}

// {%- 代表删除其前面的空白字符，-%}代表删除其后空白字符
// {{- 和 -}}类似
```

-----------

# 参考

1. nunjucks官网：https://mozilla.github.io/nunjucks/