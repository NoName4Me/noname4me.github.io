---
title: JS日志（console.xx）
date: 2017-12-07 00:00:03
categories:
- 前端
- JS
tags:
- 日志
- console
---

> `console.xx()`。

# 1. 基本`log/error/warn`

基本就只是样式的区别。

## 1.1 格式化输出

|格式|用途|示例(已省略`console.log`)|
|---|---|---|
|`%d` 或 `%i`|整数输出（会被忽略小数位）|`('%d', 2.7)`输出`2`|
|`%f`|浮点输出|`('%f', 2.7)`输出`2.7`|
|`%s`|字符串输出|`('%s', 'hi')`输出`hi`|
|`%o`|格式化为可扩展DOM元素，如果本身是DOM，输出类似在`Elements`下看到的|见Fig 1示例|
|`%O`|格式化为可扩展的JS对象，如果本身是DOM，输出包含该元素的JS属性|见Fig 1示例|
|`%c`|CSS语法自定义输出样式|`console.log("hi, %cjonge~","color:red;")`输出的`jonge~`是红色|

<!-- more -->

{% asset_img oO-console.png Fig1. `%o/O`格式化输出DOM %}

## 1.2 `dir`

同“1.1”中的`%O`输出。

# 2. 断言`cassert`

```js
console.assert(expression, '当前面的表达式为false时，会输出这句话。');
```

# 3. 分组`group/groupEnd/groupCollapsed`

会自动收集`group`与`groupEnd`之间的所有日志，可以嵌套使用。


# 4. 表格`table`

方便比较数组／对象中的内容。

```js
var x = [{name:'jonge1', age:30, email:'h@jonge.club'}, {name:'jonge2', age:40, email:'j@jonge.club'}, {name:'jonge3', age:50}];
console.table(x);
console.table(x,['name', 'email']);
```

# 5. 计时（`time/timeEnd`）／计数（`count`）

可以初始化一个字符串作为唯一识别码。

```js
console.time('Jonge\'s timer');
// do sth.
console.timeEnd('Jonge\'s timer');

// 输出
// Jonge's timer: 94.562744140625ms

// 计数，比如记录某个函数被调用次数
function test() {
    console.count("test called cnt");
}

// 输出
// test called cnt: 1
```