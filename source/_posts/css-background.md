---
title: 背景（background），了解一下。
date: 2018-03-16 21:44:06
categories:
- 前端
- CSS
tags:
- background
---

# 1. 基础知识


# 2. 深入了解

## 2.1 渐变

* `linear-gradient`线性渐变
* `radical-gradient`径向渐变
* `repeating-上面两个`重复其中规则直到铺满背景（很适用于拼贴）

**注意**，倾斜角度，实际上只是倾斜的最小贴片单位（`background-size`指定），而不是整个背景，如下面示例的图2，要想无缝拼贴，只能手动找出最小拼贴单位（如图3中左上角小方块），所以一般使用`repeating-xx-gradient`来完成这种需求（图4）。

```css
/* 最小贴片无缝拼贴 */
.tile {
    background-image:linear-gradient(45deg, #000 25%, #fff 0,#fff 50%, #000 0, #000 75%,#fff 0);background-size:28.28px 28.28px;
}
/* repeating-linear-gradient */
.repeat {
    background-image:repeating-linear-gradient(45deg, #000, #000 10px,#fff 0,#fff 20px);
}
```

示例如下（*审查元素*查看源码）：

{% raw %}
<section style="display:flex;box-sizing:border-box;padding:0 40px;width:100%;justify-content:space-around;flex-flow:wrap;">
    <div style="width:100px;height:100px;background-image:linear-gradient(to left, #000 50%, #fff 0);background-size:20px 20px;box-shadow:0 0 16px 2px rgba(0,0,0,.4);">
    </div>
    <div style="width:100px;height:100px;background-image:linear-gradient(45deg, #000 50%, #fff 0);background-size:20px 20px;box-shadow:0 0 16px 2px rgba(0,0,0,.4);">
    </div>
    <div style="position:relative;width:100px;height:100px;background-image:linear-gradient(45deg, #000 25%, #fff 0,#fff 50%, #000 0, #000 75%,#fff 0);background-size:28.28px 28.28px;box-shadow:0 0 16px 2px rgba(0,0,0,.4);">
        <div style="position:absolute;width:28.28px;height:28.28px;border:1px solid #f93;color:#f93;font-size:16px;text-align:center;font-weight:900;">1</div>
    </div>
    <div style="width:100px;height:100px;background-image:repeating-linear-gradient(45deg, #000, #000 10px,#fff 0,#fff 20px);box-shadow:0 0 16px 2px rgba(0,0,0,.4);">
    </div>
</section>
{% endraw %}

----
# 参考

1. 《CSS揭秘》
