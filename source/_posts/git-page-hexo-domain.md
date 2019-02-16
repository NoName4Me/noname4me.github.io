---
title: GitHub Pages + hexo（及一些博客插件）+ 域名 试水个人博客
date: 2017-11-04 21:14:10
categories:
- 利器
tags:
- hexo
- hypercomments
- GitHub Pages
---

# 轻量级建博客站

## 1. GitHub Page

这个就不多说了，见[官方doc](https://pages.github.com/)，创建`你的github名字.github.io`的仓库，然后上传网站文件到该仓库就可以通过`你的github名字.github.io`访问啦～✌️

## 2. 绑定域名

* 购买域名（很便宜的啦）
[阿里云购买(万网)](https://www.aliyun.com/)
[腾讯云购买，同上](https://cloud.tencent.com/)

* 绑定域名指向github个人主页

在域名解析管理中，增加**类型**为`CNAME`、**主机记录**分别为`@`和`www`、**记录值**为`yourGithubName.github.io`的2条解析记录，不建议`A`类型绑定`ping xx.github.io`得到的IP，这个会变。

* 设置`yourGithubName.github.io`跳转到你的域名

进入你的github.io项目的setting，`Custom domain`里输入要绑定的域名，保存。

如果你使用的是hexo框架建站，那么可以在source目录下新建一个`CNAME`的文件（没有任何后缀），文件内容是你的域名`xxx.xx`不要带`http://`、`wwww`等前缀，保存发布（默认会发布到主页仓库的根目录）。

>**此处扯点儿淡，阿里云买的域名不知是之前绑定了香港服务器搭梯子，然后最近开会的原因还是怎么滴，网页访问一直是DNS解析失败，重新绑定到github.io也没用，最后把DNS地址换成了腾讯云提供的居然可以了🤦‍♂️。**

## 3. hexo建站
一句话：按照[Hexo官方Doc](https://hexo.io/docs/)来就对了。

<!-- more -->

* 一些可能会用到的配置：
1. 设置不解析某些源文件为博文，配置`_config.yml`中`skip_render: ['**/*.html', '**/*.js', '**/*.map']`

## 3.1 自定义页面

比如自定义分类页面：`hexo new page categories`，会在source目录下生成`categories`目录，其中有个`index.md`，修改其中的信息如下：

```yml
title: 分类
date: 日期（默认会生成）
type: "categories"（注意这个要和主题中设置的相匹配）
comments: false（这个视自己情况定）
```

并在对应的主题配置中开启主页显示分类，以Next为例：

```yml
menu:
  categories: /categories/
```

## 4. 搜索（Algolia）

博文一多，自己分类、标签不明确很容易把自己都弄迷路，所以`搜索吧，少年～`。

作者使用的是NexT主题，目前已经内置支持，不要配置太多东西。

[官方Doc: NexT主题支持Algolia](http://theme-next.iissnan.com/third-party-services.html#algolia-search)

* 注册，获取API Key，配置

注册账号，进入dashboard，在Indices下新建Index，在API Key下获取接入配置（注意保密哈），在`站点配置文件`内增加：
```yml
# applicationID、apiKey、adminApiKey、indexName均为Aloglia获取的配置
algolia:
  applicationID: 'Application ID'
  apiKey: 'Search-Only API Key'
  adminApiKey: 'Admin API Key'
  indexName: 'Index Name'
  chunkSize: 5000
```

修改`主题配置文件_config.yml`中的Algolia Search为true。
```yml
# Algolia Search
algolia_search:
  enable: true
  hits:
    per_page: 10
  labels:
    input_placeholder: Search for Posts
    hits_empty: "不好意思，木有'${query}'的搜索结果😂"
    hits_stats: "${hits} results found in ${time} ms"
```

* 安装命令行
```bash
# 安装插件命令行
npm install --save hexo-algolia
```

执行`hexo algolia`生成索引。

可能会有问题（意思是要用一个单独与search的key来维护索引文件），在Algolia页面新建一个API Key（注意最下面的勾选项），或者修改已有的API Key：

>ERROR [Algolia] Please set an `HEXO_ALGOLIA_INDEXING_KEY` environment variable to enable content indexing.
>ERROR >> Read https://npmjs.com/hexo-algolia#api-key for more informations.

![algolia add new key](https://raw.githubusercontent.com/oncletom/hexo-algolia/HEAD/algolia-write-key.png)

然后执行`export HEXO_ALGOLIA_INDEXING_KEY=刚才新建的ApiKey`，再执行`hexo algolia`即可。

## 5. 评论(hypercomment)

在[hypercomment主页](https://www.hypercomments.com/)注册，然后在wideget页面，将ID输入到`主题配置文件_config.yml`对应的hypercomments插件配置处：
```yml
# Hypercomments
hypercomments_id: id
```

{% asset_img hypercomments.png Fig2. Get Hypercomments ID %}

效果如下：

{% asset_img hypercomments-test1.png Fig3. 评论输入中 %}

{% asset_img hypercomments-test2.png Fig4. 评论效果 %}

其它主题内置的评论插件看个人喜好按Doc去设置就可以。

## 6. 自定义页面