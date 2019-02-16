---
title: 正则，get。
date: 2018-04-20 23:04:38
categories:
- 前端
- JS
tags:
- 正则
- regexp
---

# 1. 基础

基础的东西就直接查看 [MDN RegExp Doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)吧。
<!-- more -->

## 1.1 反义

|代码|说明|
|----|----|
| `\W` |匹配任意不是字母，数字，下划线，汉字的字符|
| `\S` |匹配任意不是空白符的字符|
| `\D` |匹配任意非数字的字符|
| `\B` |匹配不是单词开头或结束的位置|
| `[^x]` |匹配除了x以外的任意字符|
| `[^aeiou]` |匹配除了aeiou这几个字母以外的任意字符|

## 1.2 反向引用

`\b(\w+)\b\s+\1\b` 中 `\1` 表示引用前面匹配的第一组内容，即 `(\w+)`，举个例子：`"Jonge, go go!"` 会匹配出 `"go go"`。

* 捕获
  - `(A)`：匹配 `A`，并捕获文本到自动命名的组里，
  - `(?<name>A)`：匹配 `A`，并捕获文本到名称为 `name` 的组里，引用时使用 `\k<name>`，比如 `/^(?<name>abc)\w*\k<name>$/` 匹配 `abc` 开头和结尾的字符串
  - `(?:A)`：匹配 `A`，不捕获匹配的文本，也不给此分组分配组号：
* 零宽断言（**注意：** 后两者`lookbehind`是 ES2018 的特性，但V8已经实现）
  - `A(?=B)`：匹配后面有 `B` 跟着的 `A`，`/bar(?=bar)/` 匹配 `foobarbarfoo` ，第1个 `bar`。
  - `A(?=B)`：匹配后面不跟 `B` 的 `A`，`/bar(?!bar)/` 匹配`foobarbarfoo` 到第2个 `bar`。
  - `(?<=B)A`：匹配前面是 `B` 的 `A`，`/(?<=bar)bar/` 匹配 `foobarbarfoo` ，第2个 `bar`。
  - `(?<!=B)A`：匹配前面不是 `B` 的 `A`，`/(?=bar)bar/` 匹配 `foobarbarfoo` ，第1个 `bar`。
* 注释：`(?#comment)`，这种类型的分组不对正则表达式的处理产生任何影响

## 1.3 正则匹配的原理

正则就是基于这种有穷自动机的理论的，正则里的这种自动机叫做正则引擎。

### 1.3.1 有穷自动机

有穷自动机一般满足下列4个条件：

1. 有限多个状态
2. 有状态切换机制
3. 有起始状态
4. 有终止状态

举个例子，正则表达式 `a(bb)+a` 的状态转移图如下：
<img src="https://raw.githubusercontent.com/NoName4Me/blog/master/source/_posts/master-regexp/finite-states-example.png" width=480>

下面是一个匹配字符串 `"abbbba"` 的分解步骤：

<img src="https://raw.githubusercontent.com/NoName4Me/blog/master/source/_posts/master-regexp/finite-states-example-steps.png" width=400>

实际上下面两个有穷状态机和前面的是等价的，下面第 1 个图里在输入 `ab` 后，在状态 S2，如果继续输入 `b`，那么此时的状态就不确定了，可能在S1，也可能在 S3，而第 2 个图更神奇，在没有任何输入的情况，也会转移到 S1，所以这两个状态机叫做非确定型有穷自动机（NFA，Non-definite Finite Automata），最前面那个状态机是确定型有穷自动机（DFA），每一个状态到另一个状态都是确定的。

<img src="https://raw.githubusercontent.com/NoName4Me/blog/master/source/_posts/master-regexp/finite-states-nfa-example-steps.png" width=480>

### 1.3.2 匹配优先和忽略优先

匹配优先（贪婪）：当表达式中的某个位置不确定是否匹配时，优先选择**匹配**，如果该位置后的表达式无法继续匹配，则逐步回溯。
忽略优先（懒惰）：当表达式中的某个位置不确定是否匹配时，优先选择**忽略**，如果该位置后的表达式无法继续匹配，则选择匹配，继续往下测试。

以表达式 `ab.*a` 、 `ab.*?a` 和字符串 `"ababac"` 来说明：

```
ab.*a（匹配优先）
ab 匹配 ab
ab.* 匹配 ababac
此时，表达式里还有个a未匹配，逐步回溯（此例回溯1步），匹配到ababa，结束。

ab.*a（忽略优先）
ab 匹配 ab
.*?选择不匹配，测试表达式里的a，可以匹配，整体匹配到aba，结束。
```

`*`、`+`、`?`、`{m,n}` 是贪婪模式，对应的懒惰模式是 `*?、`+?`、`??`、`{m,n}?` 。

# 2. 两个工具

1. 可视化正则模式：https://regexper.com
2. 正则小抄、拆解：https://regexr.com/

----

# 参考

1. [正则表达式30分钟入门教程](http://deerchao.net/tutorials/regex/regex.htm)
2. [ECMAScript regular expressions are getting better!](https://mathiasbynens.be/notes/es-regexp-proposals)
3. [RegExp lookbehind assertions](https://v8project.blogspot.com/2016/02/regexp-lookbehind-assertions.html)
4. 《正则指引》余晟
5. https://stackoverflow.com/questions/2973436/regex-lookahead-lookbehind-and-atomic-groups