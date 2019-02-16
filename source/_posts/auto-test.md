---
title: 前端自动化测试
date: 2018-04-30 10:11:52
categories:
- 前端
- JS
tags:
- 自动化测试
---

为什么要做自动化测试？因为你一定不想当某个小修改后手动把所有场景去测试一遍，这一条就足够启动自动化测试了。

<!--more-->
# 1. 单元测试

## 1.1 Mocha框架

它是一个开源的、支持异步测试的测试框架，主要模块：

* `mocha` 核心：组织自己的测试架构。
* `assertions` 库： 比如`chai`、`should.js`等。

下面以浏览器上测试简单说明：
源码[点击这里](https://github.com/NoName4Me/mocha-demo)获取。

```js
 // 一个关于xx功能的测试，下面以测试 pow 函数为例子
describe('pow', function() {
    // 一个测试实例
    it('2 的 3 次方是 8', function() {
        assert.equal(pow(2, 3), 8);// 调用 pow 函数，并比较其输出和预期是否相等
    });
});

// 当然 describe 可以嵌套，实现功能的细分组
describe('pow', function() {
    describe('异常值测试', function() {})
    describe('普通值测试', function() {})
});

// 钩子：测试前／后的调用的接口
before(() => alert("Testing started – before all tests"));
after(() => alert("Testing finished – after all tests"));

beforeEach(() => alert("Before a test – enter a test"));
afterEach(() => alert("After a test – exit a test"));

// only skip
describe.only(); // 只执行 only 标示的测试用例组
describe.skip(); // 跳过 skip 标示的测试用例组
it.only(); // 只执行该样例，其他普通的 it() 会被跳过
it.skip(); // 跳过该样例
```

**注意：** 一个 `it` 就是一个测试样例，不要把多个样例混在一起，不然在复杂场景下出错不容易定位。不要注释 `it` 里的内容，用 `it.skip()`，因为单纯注释看到的结果是**该用例测试通过**，还可以用 `this.skip()` 来跳过后面的所有代码。

更多知识参考mocha官网：https://mochajs.org/

## 1.2 Jest

# 2. 端到端