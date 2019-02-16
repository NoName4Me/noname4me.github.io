---
title: css动画（animation）
date: 2018-03-02 23:33:58
categories:
- 前端
- CSS
tags:
- animation
---

最近在做[100 Days CSS chalenges](https://codepen.io/collection/XgmakG/)练习时，发现animation这部分知识原来并没有整体的学过，于是有了这篇学习笔记。

# 1. 引用动画

# 1.1 基础
这个属性一共有8个子属性，取值（第一个是默认值）如下：
<!---more-->
* `animation-name`: `none`
* `animation-timing-function`: `ease`，可取贝塞尔曲线、帧函数`frame()`，步进函数`steps()`，具体见`1.2`节。
* `animation-duration`: `0s`，即使是`0`也要带单位哦，还支持`ms`
* `animation-delay`: `0s`
* `animation-iteration-count`: 1，可取`infinite`无限循环，可以取多值`1,2,3`，每当动画播放，会顺序的循环取用该多值；
* `animation-direction`: `normal`，可取`alternate`正反间隔播放，`reverse`反向播放，`alternate-revser`反正间隔播放；
* `animation-fill-mode`: `none`，可取`fowards`动画结束停留在最后一帧，`backwards`动画开始前停留在第一帧（如果有延迟会比较直观），`both`前两者一起
* `animation-play-state`: `running`，可取`paused`，设置动画暂停，或播放(`running`)

animation属性多值可以参考[这里](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations#Setting_multiple_animation_property_values)，基本原则就是`animation-name`去匹配其它属性，如果其它属性值个数少于`animation-name`，则循环重复使用，比如：

```css
/* 三种动画共用持续时间，fadeInOut播放2次，moveLeft300px播放1次，bounce播放2次，如果动画又被激活，那么fadeInOut播放1次，moveLeft300px播放2次，依此类推 */
animation-name: fadeInOut, moveLeft300px, bounce;
animation-duration: 2.5s;
animation-iteration-count: 2, 1;
```

**注意**：同一个元素无法使用多个动画，比如下面的示例，通过`animation-direction:reverse;`想来实现反向效果（示例中橙色），当首次触发后，无法再次播放动画，如果想复用动画，或者设置多个动画，只能通过js来清除然后添加动画，或者监听动画事件（开始／结束等）来实现，所以建议定以独立的动画（如示例中蓝色）：

{% raw %}
<p data-height="265" data-theme-id="dark" data-slug-hash="rJRbJz" data-default-tab="css,result" data-user="blurnull" data-embed-version="2" data-pen-title="animation-demo" class="codepen">See the Pen <a href="https://codepen.io/blurnull/pen/rJRbJz/">animation-demo</a> by BlurNull (<a href="https://codepen.io/blurnull">@blurnull</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endraw %}

## 1.2 动画时间函数说明

`animation-timing-function`已定义好的关键值如下：

* `ease`: `cubic-bezier(0.25, 0.1, 0.25, 1)`
* `ease-in`: `cubic-bezier(0.42, 0, 1, 1)`
* `ease-out`: `cubic-bezier(0, 0, 0.58, 1)`
* `ease-in-out`: `cubic-bezier(0.42, 0, 0.58, 1)`
* `linear`: `cubic-bezier(0, 0, 1, 1)`
* `step-start`: `steps(1, start)`
* `step-end`: `steps(1, end)`

动画的时间函数如下图所示（图中为`ease-in`时间函数），这个其实很简单，就是指定给动画的时间（`animation-duration`），和真实的动画持续时间的关系。

<img src="https://drafts.csswg.org/css-timing-1/timing-function-example.svg" alt="cubic-bezier curve" style="box-shadow:0 2px 16px rgba(0,0,0,.4);width: 400px;border-radius:2px;">

三个关键的时间函数为：

* `cubic-bezier()`: 如下图示例，曲线的参数对应其实是P1和P2的坐标值(x1, y1, x2, y2)

<img src="https://drafts.csswg.org/css-timing-1/cubic-bezier-timing-curve.svg" alt="cubic-bezier curve" style="box-shadow:0 2px 16px rgba(0,0,0,.4);width: 400px;border-radius:2px;">

* `frames()`：感觉这个和`steps()`一样啊-__-||

* `steps()`: 第一个参数是指将输入时间均分为几个步骤，第二个参数，感觉就是步骤切换是在刚进入到该步时（`start`），还是该步结束时要进入下一步前（`end`）。

<img src="https://drafts.csswg.org/css-timing-1/step-timing-func-examples.svg" alt="步进函数" style="box-shadow:0 2px 16px rgba(0,0,0,.4);width: 400px;border-radius:2px;">

# 2. 定义动画

```scss
@keyframes xx {
    from {
        // 设置CSS样式
    }
    to {}
}

//上面的就相当于
@keyframes xx {
    0% {}
    100% {}
}

// 当然你可以定义几个帧安全一样
@keyframes xx {
    0%, 20% {}
    100% {}
}
```

------

# 参考

1. W3C CSS Animation Function: https://drafts.csswg.org/css-timing-1/