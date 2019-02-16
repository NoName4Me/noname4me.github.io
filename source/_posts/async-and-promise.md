---
title: 异步以及Promise
date: 2018-01-06 20:36:21
tags:
- 读书笔记
- async
- promise
- 异步
categorie:
- 前端
- JS
---


promise如果有多个then，它们相互不会影响，如下例中"C"的处理不会影响也不会先于"B"。

```js
p.then( function(){
	p.then( function(){
		console.log( "C" );
	} );
	console.log( "A" );
} );
p.then( function(){
	console.log( "B" );
} );
// A B C
```

如果你不确定某个函数是返回一个promise结果还是一个即时值，那么最好使用`Promise.resolve(..)`来封装一下。
```js
// don't just do this:
foo( 42 )
.then( function(v){
	console.log( v );
} );

// instead, do this:
Promise.resolve( foo( 42 ) )
.then( function(v){
	console.log( v );
} );
```


`Promise.resolve(..)`可以将任何thenable的东西转为真正的Promise（递归拆包直到非thenable的值），如果传入的是真正的Promise，那么会直接返回该Promise。结合这一点以及Promise的另外两个特点，我们就会习得Promise的链式调用技能。

* 每当你调用一个Promise的`then(..)`方法，它会返回一个新的Promise，我们可以用来*链*调用。
* 你在调用`then(..)`传入的fulfilled回调中返回的，都会自动的成为下一个*链*的fulfilled回调函数的入参。

当你从fulfillment（或者rejection）里返回一个Promise或thenble时，同样的拆包也会发生，比如：

```js
var p = Promise.resolve( 21 );

p.then( function(v){
	console.log( v );	// 21

	// create a promise and return it
	return new Promise( function(resolve,reject){
		// fulfill with value `42`
		resolve( v * 2 );
	} );
} )
.then( function(v){
	console.log( v );	// 42
} );
```
