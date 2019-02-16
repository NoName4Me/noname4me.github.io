---
title: Chrome DevTool使用
date: 2017-11-22 00:33:18
categories:
- 利器
tags:
- chrome
- devTool
---


## 1. Element

|  快捷键   |  功能  |
| -------- | ------ |
|`F2`|以HTML形式编辑|
|`ctrl + enter`|保存更改|
|`esc`|退出不保存|
|`鼠标选中移动`||
|`delete`|删除|
|`ctrl + z`|撤销|

悬浮会有高亮当前页面元素，如果不在视窗内，会提示在边缘位置，右键选择`Scroll into View`跳转到元素。

* Event Listeners

`handler`上右键选择`show function defination`跳转到源码查看定义。

* DOM Breakpoints

在`Element`页签中的元素上右键，选择`break on`中的一项，会增加断点到`DOM Breakpoints`栏目下。

<!-- more -->

>**技巧：** 许多扩展程序都会将其自己的事件侦听器添加到DOM上。如果遇到有些不是你的代码设置的事件侦听器，可以在隐身窗口中重新打开页面，默认情况下，隐身窗口会阻止扩展程序运行。

## 2. Animation

位于`Element`同级的更多菜单里进入，或者`ctrl + shift + p`输入`Animation`选择`Drawer Show Animations`进入。

{% asset_img annotated-animation-inspector.png Fig1. 动画面板 %}

1. Controls：可以清除所有当前捕捉的动画组，更改选定动画组的速度。
2. Overview：在这里选择动画组，然后在 Details 窗格中进行检查和修改。
3. Timeline：可以暂停和启动动画，或者跳到动画中的特定点。
4. Details：查看和修改当前选定的动画组（左侧深色代表定义，右侧浅色代表重复，实心球动画起止，空心球关键帧）。

## 3. Styles

|菜单|功能|
|----|----|
|`Filter`|就是搜索啦|
|`.cls`|增加类|
|`+`|增加css规则|
|`长按+`|增加css规则，并选择添加到哪个样式文件里|
|`点击某个颜色前面的彩色小方块`|打开颜色拾取器|
|`shift + 鼠标左击颜色块`|切换颜色描述方式（rgb、hsl、十六进制）|

## 4. Sources

* 设置条件断点

在某一行行号处右键，`Add conditional breakpoint...`，输入条件回车。（若已有断点，选择`Edit breakpoint`即可。）

* 常用快捷键

|  快捷键   |  功能  |
| -------- | ------ |
|`ctrl + p` |打开命令行（输入`?`可以看到支持的命令类型）|
|`ctrl + g` | 跳转行 |
|`ctrl + p` | 打开文件 |
|`F11`|进入函数|
|`shift + F11`、`ctrl + shift + ;`|跳出函数|
|`ctrl + shift + f`|全局搜索|

* Source Map

源码与压缩（或者编译）后的代码的映射，便于调试。

示例代码：

`test.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="test.min.js"></script>
    <title>Source Map Demo</title>
</head>
<body>
</body>
</html>
```
`test.js`
```js
function justTest(name) {
    var addr = "jonge.club";
    console.log("hi "+name+", you are on "+Addr+" at "+new Date()+".");
}

justTest("stranger");

```

使用source map（以uglify-js为例说明）

```bash
# 安装uglify-js
npm install uglify-js -g

# 生成包含source map信息的压缩后js文件
## 确保root/url可以被访问到，root也可以是网络地址
uglifyjs test.js -o test.min.js -c -m --source-map "root='/some/path',url='test.min.js.map'" 
```
压缩后的js文件（test.min.js）：
```js
function justTest(t){console.log("hi "+t+", you are on "+Addr+" at "+new Date+".")}justTest("stranger");
//# sourceMappingURL=test.min.js.map
```

在Chrome里开启Source Map（默认开启，`Settings`里），访问test.html，`F12`调试代码（源码）。


## 5. 其他

* DevTool面板

|  快捷键   |  功能  |
| -------- | ------ |
|`ctrl + +/-` | 窗口放大/缩小 |
|`ctrl + 0` | 窗口默认大小 |
| `ctrl + shift + j` | 开启Dev模式，并定位到console页签 |
| `ctrl + [` | 页签切换(向左) |
|`ctrl + shift + p`|DevTools Command Menu|

* Console页签


|  快捷键   |  功能  |
| -------- | ------ |
|<code>ctrl + &#96;</code> | 聚焦到console |
|‘ctrl + l`|清空控制台|


* 开启实验功能

`chrome://flags/#enable-devtools-experiments`

`Settings` --> `Experiments`

[Accessibility Inspector](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a)

-----
**参考**

[1] [Chrome DevTool Doc](https://developers.google.com/web/tools/chrome-devtools/)

[2] [UglifyJS2 @github](https://github.com/mishoo/UglifyJS2)
