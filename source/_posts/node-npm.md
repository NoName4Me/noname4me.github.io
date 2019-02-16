---
title: node.js和npm
date: 2018-01-31 16:27:48
categories:
- 前端
tags:
- npm
---
# 1. 基本知识

## 1.1 安装

* node.js（含npm）安装

window直接[官网](https://nodejs.org)下载安装即可。

其它环境及安装方式见：https://nodejs.org/en/download/package-manager/
<!-- more -->
* npm安装依赖包

```bash
# 安装最新版本
npm install koa
# 安装指定版本
npm install koa@2.3.0
# 卸载
npm uninstall koa
# 全局安装
npm install -g xx

# 安装并写入到package.json依赖管理中
npm install xxx --save
# --save在dependencies下，--save-dev在devDependencies下
# 同样的，uninstall也可以--save来删除到package.json

# 生成项目配置文件package.json
npm init
# 表示可以接受默认值
npm init -y
```

更多npm使用指导见：https://docs.npmjs.com/getting-started

## 1.2 配置

### 1.2.1 中央仓库（镜像）

* 指定源（镜像）

国内[淘宝镜像](https://npm.taobao.org/)与`npmjs.org`源10分钟同步一次。

```bash
# 指定某次安装的源（淘宝镜像）
npm install -g cnpm --registry=https://registry.npm.taobao.org

# 配置当前命令行的源
```

## 1.2.2 配置文件（`npmrc`）

优先级依次递减：

* 工程内的配置文件（`/path/to/my/project/.npmrc`）
* 用户配置文件（`~/.npmrc`）
* 全局配置文件（`$PREFIX/etc/npmrc`）
* npm的内建配置文件（`/path/to/npm/npmrc`）

npmrc配置文件内各个配置项说明：https://docs.npmjs.com/misc/config

## 1.3 node和npm升级

window的直接官网下载，覆盖安装即可。

```bash
# node升级
sudo npm cache clean -f
sudo npm install -g n
sudo n stable

# npm升级
sudo npm install npm@latest -g
```

> **说明**
* `npm cache clean`：清除npm缓存
* `npm install -g n`：安装管理node的模块
* `n stable`：安装稳定版本，也可以`n latest`安装最新版本，或者`n 版本号`安装指定版本
* `npm install npm@latest -g`：安装最新版本npm


# 2. 一个工程

## 2.1 package.json

```bash
# 自定义命令
## 在package.json的scripts里面设置
"cmd": "some cmd..."

#执行该命令
npm run cmd


#执行多个命令
## 打开网页并启动服务(MAC)
"start": "open http://localhost:3001 && node index.js"
npm start

## 打开网页并启动服务(MAC)
"start": "open http://localhost:3001 && node index.js"

## 启动两个服务
"s1": "node server1.js &",
"s2": "node server2.js &",
"start": "npm run s1 && npm run s2"
### 或者"start": "node server1.js & node server2.js"

### 或者使用并发模块
npm install concurrently -g
"s1": "node server1.js",
"s2": "node server2.js",
"start": "concurrently \"npm run s1\" \"npm run s2\""
npm start
```