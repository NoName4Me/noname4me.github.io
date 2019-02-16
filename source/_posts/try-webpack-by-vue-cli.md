---
title: try-webpack-by-vue-cli
date: 2018-04-25 00:15:41
tags:
---

```js
const path = require('path');
const config = {
    // 入口指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 入口起点（直接和间接）的依赖。
    entry: './path/to/my/entry/file.js', // 入口可以一个或多个

    // 告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件。
    output: { // 
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js'
    },

    // loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。
    module: {
        rules: [{
            test: /\.txt$/, // 需要转换的文件
            use: 'raw-loader' // 怎么转换
        }]
    },

    // loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

    // 想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({template: './src/index.html'})
    ]
    }
};
module.exports = config;
```