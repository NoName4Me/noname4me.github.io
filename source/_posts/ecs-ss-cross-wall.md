---
title: 阿里云ECS+shadowsocks 科学上网
date: 2017-10-19 23:39:17
categories:
- 利器
---

# 嗯，曲线救国— —||。

>阿里ECS+ShadowSocks.

## 搭建过程

* STEP_1

购买阿里ECS（AWS的EC2也行，据说绑定信用卡送一年呢）

* STEP_2

登陆ECS，安装ShadowSocks
```bash
# 这里只示例一键安装python版，其它的参考文末
wget --no-check-certificate -O shadowsocks.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh

# 设置权限
chmod +x shadowsocks.sh

# 配置ss，安装相关依赖库
## 这里会提示输入IP／端口／密码（其它端使用ss时会用到）
./shadowsocks.sh 2>&1 | tee shadowsocks.log

# 安装完成会展示刚才输入的信息，注意保存。
```
<!-- more -->

* STEP_3
配置ECS开启上面设置的端口，在阿里云控制台，进入ECS实例管理，找到对应的实例，`操作`列中，`更多`里选择`安全组配置`，在`配置规则`中增加*入方向*的规则即可。

* STEP_4

```bash
# 启动ss
启动：/etc/init.d/shadowsocks start
```
* STEP_5

客户端下载及配置。（很简单，下载客户端，添加上面配置的IP:PORT+密码即可）

[shadowsocks官网](https://shadowsocks.org/en/index.html)

[github地址](https://github.com/shadowsocks)

## 参考

```bash
# ss相关其它命令
停止：/etc/init.d/shadowsocks stop
重启：/etc/init.d/shadowsocks restart
状态：/etc/init.d/shadowsocks status
卸载：./shadowsocks.sh uninstall

# ss的配置文件（可以设置多用户什么的）
vi /etc/shadowsocks.json
```

**[shadowsocks python版](https://teddysun.com/342.html)**

**[开发者提供的FAQ](https://teddysun.com/399.html)**

**[shadowsocks安装四合一(R/python/Go/libev)版本](https://teddysun.com/486.html)**