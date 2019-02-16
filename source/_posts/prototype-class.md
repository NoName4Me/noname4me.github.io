---
title: JS中的面向对象（原型到类）
date: 2018-04-06 22:07:28
categories:
- 前端
- JS
tags:
- 面向对象
- 原型
---

*假设你已经有基本的面向对象编程概念，所以……如果没有，请[点击这里](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Basics)。*

<!--more-->
# 1. 预热

## 1.1 对象（里看原型）

一句`var a = { xx: 23 };`，都出现了些什么关系网：

<img src="https://raw.githubusercontent.com/NoName4Me/blog/master/source/_posts/prototype-class/prototype-link-object.png" width=560>

**注意：**JavaScript里比较特殊的是`Object`、`String`、`Number`等的构造器都是继承的`Function`。

## 1.2 函数（里看原型）

假设让你设计一个可以创建对象的方法，你可能首先会想到这种：

```js
function createNewPerson(name) {
  var obj = {};
  obj.name = name;
  obj.greeting = function() {
    alert('Hi! I\'m ' + this.name + '.');
  };
  return obj;
}

// create a object `person` named 'Jonge'
var person = createNewPerson('Jonge');
person.greeting();
```

好的，我们得到了一个新的对象`person`。可这个函数每次调用都要创建一个空对象，然后设置相应的属性后返回，总觉的有点儿绕。

嗯，想想JavaScript中的`this`，我们重写一下上面的方法：

```js
function Person(name) {
  this.name = name;
  this.greeting = function() {
    alert('Hi! I\'m ' + this.name + '.');
  };
}

var person = new Person('Jonge');
person.greeting();

var person1 = Object.create(person); // 注意，person1的行为虽然和person一样（person1.name以及greeting），但两者是不同的，后面的原型链部分会说明Object.create
```

以上得到的原型关系图如下（已经省略了`Object`那一层）：

<img src="https://raw.githubusercontent.com/NoName4Me/blog/master/source/_posts/prototype-class/prototype-link-function.png" width=560>

这个就叫构造函数，一般首字母大写，和最上面生成对象一样，我们把创建新对象的步骤交给了`new`，已经开始优雅起来了，可是`greeting`这个函数每次都要新建，不太好。

# 2. 基于原型的语言

## 2.1 原型链

JavaScript被描述为基于原型的语言，即所有对象都有一个 `prototype object`（原型对象），它从原型对象继承方法、属性，当然原型对象还有自己的原型对象，依次直到 `Object` ，这便是**原型链**啦，原型链上的属性和方法都会在它以及它的下一级访问到（当然也可能被下一级覆盖了）。

**注意：**构造函数的属性`prototype`指向的对象即实例对象`__proto__`（`Object.getPrototypeOf()`）访问的对象，而不是原型对象实例本身。还是看前面那个构造函数`Person`，`person.__proto__` 、 `Object.getPrototypeOf(person)` 和 `Person.prototype` 得到的都是对象`{constructor: f}`（`f`是函数`Person`）， `person.__proto__.__proto__` 是 `Object` 的构造函数对象。

这样，我们把`greeting()`提取到原型对象里（让它可以被继承）：

```js
function Person(name) {
  this.name = name;
}

Person.prototype.greeting = function() {
    alert('Hi! I\'m ' + this.name + '.');
};
```

好，现在我们想要一个可以指定年龄的人，我们复用构造函数`Person`：

```js
function AgedPerson(name, age) {
    Person.call(this, name); // 注意这个this的上下文
    this.age = age; // 新的属性：age
}
```

* `instanceof` 操作符

以 `obj instanceof constructor` 为例说明，`instanceof` 的作用是判断 `constructor.prototype` 是否在 `obj` 的原型链上。

**注意2点：**

1. JS中的对象都是由Object这个构造函数生成的实例（构造函数也不例外）
2. `Object`、`Function`、`Array` 等构造函数都是构造函数 `Function` 的实例

```js
// Function instanceof Object > true
Function.__proto__.__proto__ === Object.prototype

// Object instanceof Function > true
Object.__proto__ === Function.prototype

// 下面两个也都是true
Object instanceof Object
Function instanceof Function
```

## 2.2 继承

但是`AgedPerson`的的原型对象不是`Person.prototype`，而是`AgedPerson.prototype`，两者仍然没有继承关系，所以我们需要设置它们的关系：

```js
// 设置原型关系：AgedPerson.prototype 继承 Person.prototype
AgedPerson.prototype = Object.create(Person.prototype);

// 但是这时，AgedPerson的原型构造器成了Person，而不再是AgedPerson，所以我们需要让它重新指回来
AgedPerson.prototype.constructor = AgedPerson;
```

**注意：** 这里解释下前面的`Object.create()`做了什么，我们可以从它的[Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill)里看出些名堂来：

```js
if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        // 这里省略一些校验，感兴趣可以点击上面的Polyfill链接查看
        
        function F() {}
        F.prototype = proto;
        
        return new F();
    };
}
```

所以`new MyObject()`相当于`Object.create(MyObject.prototype)`，意思就是创建一个新对象，并且它的原型是`MyObject.prototype`，**但是**，`new`还是有点儿区别的，它经历了这么3个步骤：

1. 新创建一个对象，它继承`MyObject.prototype`里的属性；
2. **调用`MyObject`这个构造方法，然后把`this`绑定给新创建的对象；**
3. 构造器返回的对象会将成为`new`的结果，如果构造函数没有返回（一般情况下没有返回），那么就用第1步里的对象；

那我们如果想要覆盖从`Person`原型继承的方法`greeting`呢，可以这么写：

```js
AgedPerson.prototype.greeting = function() {
 // 新的定义
}
```

以上得到的原型关系图如下：

<img src="https://raw.githubusercontent.com/NoName4Me/blog/master/source/_posts/prototype-class/prototype-link-inherit.png">

## 2.3 `class`语法糖

已经晕了有没有，没关系，ES6里用了`class`及一些关键词帮我们完成了那些工作，现在你只要这么写：

```js
class Person {
  constructor(name) {
    this.name = name;
  }

  greeting() {
    alert('Hi! I\'m ' + this.name + '.');
  }
}

class AgedPerson extends Person {
  constructor(name, age) {
    super(name); // 调用父类的构造器
    this.age = age;
  }

  // 重新实现此方法
  greeting() {
    // 新的定义
    // maybe call super.xxMethod()
  }
}
```

-----

# 参考

1. [MDN - JavaScript 对象](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects)
2. [CSDN - JS原型图形详解](https://cnodejs.org/topic/56f2458f02c237a73a1a8a8a)