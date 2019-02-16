---
title: JS V8引擎了解，以及5点编码优化
date: 2018-04-19 10:20:42
categories:
- 前端
- JS
tags:
- 引擎
- V8
---

一些流行的JavaScript引擎：
<!--more-->

* V8：开源，Google，C++；
* Rhino：Mozilla组织维护，Java；
* SpiderMonkey：第一个JavaScript引擎，曾经被Netscape浏览器采用，如今是火狐；
* JavaScriptCore：开源，Apple 开发给 Safari；
* KJS：KDE的引擎，最初由 Harry Porten 给KDE的Konqueror浏览器项目开发的；
* Chakra： IE（JScript9），Edge（JavaScript）；
* Nashorn：OpenJDK的一部分，由Oracle Java和Tool Group编写；
* JerryScript：Internet of Things 的轻量引擎。

V8：用于node.js和Chrome。

# 1. 一些关于V8的知识

## 1.1 V8概览

V8通过实现JIT（Just-In-Time）编译器，在执行时将代码编译为机器码，像很多引擎一样，比如 SpiderMonkey、Mozilla的Rhino。

在V8以前，它使用两个编译器：

* full-codegen：一个产出简单但相对慢一些的机器代码的简单快速编译器
* Crankshaft：一个更复杂的优化编译器（Just-In-Time），可以产出高度优化的代码

V8引擎内部有这么几个线程：

* 一个主线程：取你的代码，编译并且执行；
* 一个编译线程：不同于主线程中的编译，它保证主线程在编译线程优化代码时持续执行；
* 一个分析线程：它找出耗时的运行时方法，从而 Crankshaft 可以优化它们；
* 一些处理垃圾回收的线程。

## 1.2 V8工作过程

当执行 JavaScript 代码时，V8 启动 full-codegen，它将JS代码直接解析（没有任何改变）为机器代码，这样使得它可以快速的执行机器代码。**注意：**V8 没有使用任何任何中间过程的字节码，这样就不需要解释器了。

当你的代码运行一段时间后，分析线程已经收集了关于该优化那个方法的足够数据。

然后，Crankshaft 在另一个线程里开始优化，它将JS抽象语法树翻译为高级别的静态单赋值（SSA）方式（[百科：SSA](https://zh.wikipedia.org/zh-hans/%E9%9D%99%E6%80%81%E5%8D%95%E8%B5%8B%E5%80%BC%E5%BD%A2%E5%BC%8F)），叫做Hydrogen，然后试着优化 Hydrogen 图，很多优化都是在这一级别进行的。

### 1.2.1 嵌入

这个很简单，就是把函数声明（函数体）复制到调用的地方。

### 1.2.2 隐蔽类

很多JS解释器都是使用字典结构来在内存里保存对象的属性的，这让访问属性比非动态语言成本要高出很多，因为后者的类型是固定的，每个属性相对于对象的根地址偏移多少都是确定的，而JS则不同，它的属性类型（确切的说是属性值的类型）是可以在运行时动态修改的，为此，V8 为 JS 实现了一种模仿这种非动态语言的机制，**隐蔽类**。

假设有这么一段代码：

```js
function Point(x, y) {
    this.x = x;
    this.y = y;
}
var p1 = new Point(1, 2);

// 我们一步步拆解
 new Point(1 ,2) // 生成一个空的类 C0                           p1-->C0
 this.x = x      // 生成一个基于 C0 的，说明属性 x 的偏移量的类 C1，p1-->C1, C0-->C1
 this.y = y      // 生成一个基于 C1 的，说明属性 y 的偏移量的类 C2，p1-->C2, C1-->C2, C0-->C1
```

图示如下：

<img src="https://cdn-images-1.medium.com/max/1600/1*spJ8v7GWivxZZzTAzqVPtA.png" width=540>

隐蔽类的生成是依赖于属性生成的顺序的，比如下面的代码，由于 `p1` 和 `p2` 的隐蔽类的转移路径不同，从而导致它们的隐蔽类也不同：

```js
var p1 = new Point(1, 2);
p1.a = 5;
p1.b = 6;
var p2 = new Point(3, 4);
p2.b = 7;
p2.a = 8;
```

### 1.2.3 内联缓存

V8 会对重复调用的方法的入参的类型进行评估（根据之前多次被调用的情况），如果它达到一定的置信区间，那么就会直接跳过确定入参类型这一步，而直接使用隐蔽类中缓存的类型来进行后续工作。

它和隐蔽类是怎么关联的呢？每当一个对象的方法被调用时，V8 引擎都会查找该对象的隐蔽类，从而确定访问某个属性的偏移量，当两个拥有相同隐蔽类的相同方法成功调用两次后，V8 会省略查找隐蔽类，直接将属性的偏移量添加到对象指针上，后面所有该方法的调用，V8 引擎都会假设隐蔽类没有被修改，使用前面查找时缓存的偏移量直接跳到对应属性的内存地址。这样大幅度提升了执行速度。

这也是为何创建对象时，最好按照固定的顺序来增加属性：

<img src="https://cdn-images-1.medium.com/max/1600/1*iHfI6MQ-YKQvWvo51J-P0w.png" width=540>

### 1.2.4 垃圾回收

V8 使用标记清除方式来实现垃圾回收，但它是增量的，即每次GC，不是遍历所有堆，尝试标记所有对象，而是遍历堆的一部分，下一次GC从之前暂停的地方继续标记。

### 1.2.5 Ignition 和 TurboFan

这是从V8 5.9 开始引入的两个东西：

* Ignition：V8 的解释器。
* TurboFan：V8 的优化编译器。

<img src="https://3.bp.blogspot.com/-mas1Y0fJ2v0/V7yn9fzkzWI/AAAAAAAABcg/gm6b8X66L7oQ8Rw1z2kFO2RcAY9OgaszwCLcB/s1600/ignitionpipeline.png" width=540>

# 2. 编码优化

* **对象属性的顺序**：初始化对象属性时最好使用相同的顺序，这样后续的优化代码、隐蔽类可以被共享；
* **动态属性**：当对象初始化之后，为其增加属性会强制隐蔽类的改变，并且降低为该隐蔽类优化的任何方法，所以最好在构造器里初始化所有属性；
* **方法**：那些重复执行相同方法的代码比执行许多只执行一次的不同方法代码快；
* **数组**：避免 key 不是递增数字的松散数组，没有任何元素的松散数组是哈希表。这种数组里的元素访问时代价很高。并且，避免预分配大数组，最好是按需增长。最后，不要删除数组里的元素，它会导致松散的key。
* **标记的值**：V8 使用 32 位表示对象和数字。它使用一个比特来标示是对象（flag = 1）还是被称为 SMI（SMall Integer，只有31位）的整数（flag = 0）。所以，如果一个数字超过了31位，V8 会把这个数字装箱，将它变成double，并创建一个新对象来存放该数字，尽量使用31位有符号数字防止这种高代价的对象装箱操作。

------

# 参考

1. 本文主要参考：https://blog.sessionstack.com/how-javascript-works-inside-the-v8-engine-5-tips-on-how-to-write-optimized-code-ac089e62b12e