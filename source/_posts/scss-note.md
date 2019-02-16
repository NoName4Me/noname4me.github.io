---
title: SCSS学习笔记
date: 2018-03-13 22:28:19
categories:
- 前端
- CSS
tags:
- SCSS
---

# 1. 安装及编译

* Ruby、Sass（`gem install sass`）

* nodejs (`npm install node-sass`)

```bash
# .scss（同.sass）
sass source.scss:target.css

# 连续编译
sass --watch source.scss:target.css

# 输出样式
# 嵌套 --style nested
# 嵌套展开 --style expanded
# 单行 --style compact
# 压缩（注释、空格删除） --style compressed
```

<!--more-->

```scss
nav {
  ul {margin: 0;}
}

/* nested */
nav ul {
  margin: 0; }

/* expanded */
nav ul {
  margin: 0;
}

/* compact */
nav ul { margin: 0; }

/* compressed */
nav ul{margin:0;}
```

# 2. 语法

## 2.1 全局/局部变量

```scss
// 全局
$color:orange;
.block {
  color: $color;
}
em {
    // 局部变量
  $color: red;
  a {
    color: $color;
  }
}
```

## 2.2 混合宏

```scss
// 有参数的宏
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}

.box { @include border-radius(10px); }
// 调用
div {
  @include border-radius(3px);
}
// 带默认值
@mixin border-radius($radius: 3px)

// 多参
@mixin size($width:30px, $height:400px){
  width: $width;
  height: $height;
}

// 可变参数
@mixin box-shadow($shadow...) {
  @if length($shadow) >= 1 {
    @include prefixer(box-shadow, $shadow);
  } @else{
    $shadow:0 0 4px rgba(0,0,0,.3);
    @include prefixer(box-shadow, $shadow);
  }
}
```

## 2.3 &及嵌套

* &引用外层结构

```scss
#my-id {
  a {
    color: red;
    &:hover{color: green;}
  }
}
/* 编译结果 */
#my-id a{color: red;}
#my-id a:hover(color:green;)

.my-class {
  color: red;
  &-sub{
    color: green;
  }
}
/* 编译结果 */
.my-class{color: red;}
.my-class-sub{color: green;}
```

* 属性嵌套

```scss
.box {
  font: { // 注意冒号
   size: 12px;
   weight: bold;
  }
}
```

## 2.4 继承/占位

```scss
.base {
  color: green;
}
.btn-sub {
  font-size: 1em;
  @extend .base;
}

/* 编译后 */
.base, .btn-sub { color: geen;}
.btn-sub {font-size: 1em;}

// 占位符
%mt5 { margin-top: 5px;}
%pt10 { padding-top: 10px;}
.base {
  @extend %mt5;
}

/* 编译后 */
.base { margin-top: 5px;}
```

## 2.5 `#{}`取值（以及`nth()`）

```scss
key-value中左值（右值也能用）
$properties: (margin, padding);
@mixin set-value($side, $value) {
    @each $prop in $properties {
        #{$prop}-#{$side}: $value;
    }
}
.login-box {
    @include set-value(top, 14px);
}

// @include不能用
// @extend可用
%updated-status {
    margin-top: 20px;
    background: #F00;
}
@mixin updated-status {
    margin-top: 20px;
    background: #F00;
}
$flag: "status";
.navigation {
    @extend %updated-#{$flag}; // OK
    @include updated-#{$flag}; // Error
}
$list: (margin, padding)
$num: 2;
#{nth($table, $num)}-top: 20px; // padding-top: 20px;
```

## 2.6 数据类型
有引号的字符串在#{}后会去掉引号

```scss
@mixin firefox-message($selector) {
  body.firefox #{$selector}:before {
    content: $selector;
  }
}
@include firefox-message(".header");

/* 编译后 */
body.firefox .header:before {
  content: ".header";
}
```

## 2.7 基本运算

```scss
// + - 必须同单位或纯数字与某个单位或纯数字
// 乘法同单位会出错
// 除法同单位会抵消
width: (100px/2px); // width: 50;
// 单独除法必须括号，有其它运算时可以不加，有变量时也可以不加

// 颜色运算
p {
  color: #666 * 2; // #cccccc，超过F置为F
}

// 字符运算
p:before {
  content: X + -Man; // X-Man
  font-family: "微软"+"雅黑", sans + "serif"; // "-serif", "sans-serif"
}
```
# 3. 高级语法

## 3.1 条件和循环

```scss
//// 条件
// @if
$type: monster;
p {
  @if $type == ocean {
    color: blue;
  } @else if $type == matador {
    color: red;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}

//// 循环
// @for
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}

// @while
$i: 6;
@while $i > 0 {
  .item-#{$i} { width: 2em * $i; }
  $i: $i - 2;
}
```

## 数据和map

```scss
// 数组
$colorList: red, yellow, green;
$matrix: (x0, y0), (x1, y1), (x2, y2);

// 遍历数组
@each $animal, $color, $cursor in (puma, black, default),
                                  (sea-slug, blue, pointer),
                                  (egret, white, move) {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
    border: 2px solid $color;
    cursor: $cursor;
  }
}

// map
$map: (key1: value1, key2: value2, key3: value3);

// 遍历map
@each $header, $size in (h1: 2em, h2: 1.5em, h3: 1.2em) {
  #{$header} {
    font-size: $size;
  }
}
```

**注意：** SCSS有很多内置方法可以使用，比如操作map的`map-get`方法：

```scss
map-get(("foo": 1, "bar": 2), "foo") // 得到 1
```

更多关于`map-get`的知识[参考这里](https://sass-lang.com/documentation/Sass/Script/Functions.html#map_get-instance_method)。

------

# 参考

1. sass: https://sass-lang.com/