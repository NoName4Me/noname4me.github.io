---
title: 箭头函数和this
date: 2018-05-01 10:31:03
tags:
---

我们从一小段代码开始。思考下面4种调用 `user.hi` 方法的结果：

<!--more-->

```js
let user = {
  name: "John",
  hi: function () { console.log(this.name); },
  other: function() { console.log('other: ' + this.name); }
};

// 1
user.hi();

// 2
(user.hi)();

// 3
(user.name == "John" ? user.hi : user.other)();

// 4
let hi = user.hi;
hi();

// --------- 结果（严格模式下） ---------
// 1. "John"
// 2. "John"
// 3. Error: Uncaught TypeError: Cannot read property 'name' of undefined
// 4. 和 3 一样的错误
```

上面的例子中，第 3、4 种调用方式会报错误。因为在 JS 中，`.` 操作符返回的并不是函数，而是一个引用类型 `(base, name, flag)`，分别表示对象、对象的属性、是否严格模式，在上面的例子中，`user.hi` 返回的是 `( user, "hi", true )`，使用 `()` 进行调用时，`this` 会被赋值为 `user`，从而 `user.hi()` 得以正确执行。**而这种特殊引用值无法显示的调用（是JS源码使用的），所以赋值或用它进行其他非函数调用操作时（上例中的 3、4），这个特殊引用值会丢失，即 `this` 是 `undefiend` 的。

特殊引用类型[参见这里](https://tc39.github.io/ecma262/#sec-reference-specification-type)。

再思考这个例子，如果 `user` 如下定义，上面 4 种调用方式的结果又是什么？

```js
let user = {
  name: "John",
  hi: function () {
      let arrow = () => { console.log(this.name); }
      arrow();
  }
};
```

箭头函数没有自己的 `this`，但是它可以访问到外部作用域的 `this`。

```js
function makeUser() {
  return {
    name: "John",
    ref: this
  };
};

let user = makeUser();

console.log( user.ref.name );

// ref: this 改为 ref() { return this; } 呢
```

方法（对象中的属性函数）可以持有 `this`，

## 关于`new`

它经过下面三步：

1. 创建一个空对象，并将它赋给 `this`；
2. 调用构造函数；
3. 返回 `this`（如果构造函数返回的是对象，那么返回该对象，而不是 `this`）。

如果构造函数没有入参，那么使用 `new` 调用，可以直接 `new ConstructFunc`，省略 `()`。
强制直接调用为 `new` 调用（常用于库）：

```js
function User(name) {
  if (!new.target) { // if you run me without new
    return new User(name); // ...I will add new for you
  }

  this.name = name;
}

let john = User("John"); // redirects call to new User
alert(john.name); // John
```

递归会占用内存（executing context stack），而且 stack 过深的话，引擎会抛出异常。而循环则不会消耗太多内存。

链表翻转示例（循环、递归）：

```js
// 单向链表
let list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};

// 循环方法
function printReverseList(list) {
  let arr = [];
  let tmp = list;

  while (tmp) {
    arr.push(tmp.value);
    tmp = tmp.next;
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    console.log( arr[i] );
  }
}

// 递归方法
function printReverseList(list) {

  if (list.next) {
    printReverseList(list.next);
  }

  console.log(list.value);
}

printReverseList(list);
```