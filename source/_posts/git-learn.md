---
title: Git学习笔记（基础篇）
date: 2018-03-28 21:23:07
tags:
- git
- 版本控制
categories:
- 利器
---

*虽然用了挺久，但是都是一些基础操作，没有系统的过一遍（基础），最近正好有时间，就全面的看过一遍，记个笔记。*

# 1. Git基本概念

Git保存的不是文件的变化或差异，而是一系列不同时刻的文件快照。

Git三种状态(已修改、已暂存、已提交）对应的三个工作区域（工作目录、暂存区域以及Git仓库）
<!---more-->
<img src="https://git-scm.com/book/en/v2/images/areas.png" width=540>

基本工作流程：

1. 在工作目录中修改文件。
2. 暂存文件，将文件的快照放入暂存区域。
3. 提交更新，找到暂存区域的文件，将快照永久性存储到 Git 仓库目录。

# 2. 命令行

```bash
# 不会就翻help
git help <verb>
git <verb> --help
man git-<verb>

# 如查看config的说明
git help config
```

## 2.1 配置

```bash
# 全局配置
git config --global

# 检查配置信息
git config --list
## 检查某一项配置
git config <key>

# git别名（一些常用命令太长不想记忆）
git config --global alias.co checkout
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
## 外部命令(注意这个!)
git config --global alias.visual '!gitk'
```

## 2.2 Git基础

### 2.2.1 仓库

```bash
# 在现有目录初始化仓库（当前目录下生成一个.git目录）
git init

# 克隆一个仓库
git clone https://github.com/libgit2/libgit2
## 会在本地创建一个名为libgit2的目录，其下有.git文件夹

## 克隆时重命名
git clone https://github.com/libgit2/libgit2 newName

# 远程仓库可以有多个，不同需求下会有读写等权限限制
# 查看远程仓库(-v显示url以及读写)
git remote
## 查看远程仓库更多信息
git remote show [remote-name]

# 添加远程仓库
git remote add <shortname> <url>
## 比如 git remote add jonge_test git://github.com/xx/xx.git
## 然后你就可以通过git fetch jonge_test来获取该库上的数据了

# 拉取代码（注意fetch并不会修改到本地分支，只是获取远程的信息数据）
git pull
## 默认从git clone的仓库拉取代码，合入到本地当前分支

# 推送
git push [remote-name] [branch-name]
## 如果在你的推送前有别人的推送，那么你的推送会被拒绝，你需要先拉取一下别人的，然后再推送

# 重命名
git remote rename [remote-name] [new-name]

#删除
git remote rm [remote-name]

```

### 2.2.2 文件（目录）操作

工作目录下的文件只有两种状态：已跟踪（可能处于修改、暂存）、未跟踪（已跟踪之外的文件）。

<img src="https://git-scm.com/book/en/v2/images/lifecycle.png" width=540>

```bash
# 查看文件处于什么状态
git status

# 跟踪文件（目录，递归跟踪）
git add one-untracked-file

## 如果你修改了已跟踪的文件，那么git status会看到详细信息

# 仍然使用git add来暂存，它还能用来把冲突文件标记为已解决
git add one-untracked-file

## git status输出的信息比较冗长，可以使用-s来简化
git status -s
#  M README            -- 文件已修改但是还未放入暂存区
# MM Rakefile          -- 文件已修改且放入了暂存区，但最后的修改没有放入暂存区
# A  lib/git.rb        -- 文件是新添加的，且放到了暂存区
# M  lib/simplegit.rb  -- 文件被修改且放入了暂存区
# ?? LICENSE.txt       -- 文件未跟踪


# 查看修改详情
git diff

# 提交
git commit
## 跳过暂存，直接提交（已跟踪的文件）
git commit -a

# 移除文件(-f强制移除，针对已暂存的文件)
git rm
## 从暂存区移除（到工作区）
git rm --cached xx

## 移动（重命名）
git mv a a_backup
```

### 2.2.3 `.gitignore`

添加`.gitignore`文件，文件内容规则如下
|规则|说明|
|---|---|
|`*.[oa]`|忽略所有以`.o`或`.a`结尾的文件|
|`*~`|忽略所有以`~`结尾的文件|
|`空行`、`#开头的行`|不是规则，后者是注释，两者都会被规则忽略|
|`/`开头|防止递归|
|`/`结尾|表示目录|
|`!`开头|规则取反|
|可以使用`glob`模式匹配|比如：`a/**/z`可以匹配`a/z`、`a/b/c/z`等，`.[a-d]`忽略所有`.a .b .c .d`文件，|

github上有一个针对数十种项目及语言的`.gitignore`文件列表，可以参考：https://github.com/github/gitignore

举个例子：

```bash
# 忽略所有.a文件
*.a

# 但是跟踪lib.a，即使上面忽略所有.a文件
!lib.a

# 只忽略当前目录下的TODO，不忽略子目录下的TODO
/TODO

# 忽略目录build下的所有文件和目录
build/

# 忽略doc/notes.txt，但是不忽略doc/server/arch.txt
doc/*.txt

# 忽略doc目录下的所有.pdf文件
doc/**/*.pdf
```

### 2.2.4 历史

```bash
# 查看历史
git log

## 差异(-p)最近几次(-n，如-2)
git log -p -2

# 格式化输出
# 参考https://git-scm.com/book/zh/v2/ch00/rpretty_format
git log --pretty=format:"%h %s" --graph
```

`git log`更多选项[点击这里查看](https://git-scm.com/book/zh/v2/ch00/rlog_options)。

### 2.2.5 撤销

```bash
# 重新提交（场景：漏提交了文件，需要补提交，上次提交后没有再修改文件，且合入到一个版本里）
git commit --amend

# 取消暂存
git reset HEAD someFile

# 丢弃修改（这是一个危险操作，谨慎使用）
git checkout -- someFile
```

### 2.2.6 标签

```bash
# 查看标签
git tag
## 根据模式查找
git tag -l 'v1.*'

# 创建标签（也可以不用-a）
git tag -a yourTag
## 同时添加备注
git tag -a yourTag -m 'say sth.'
## 查看备注
git show yourTag

# 针对某次提交打标签(1234567890是提交的校验和)
git tag -a yourTag 1234567890


# 推送到远端仓库
git push [remote-repository] [tag-name]
## 推送所有未同步的标签
git push [remote-repository] --tags

# 检出标签
git checkout -b [branch-name] [tag-name]
```

## 2.3 分支

### 2.3.1 分支简介

假设有三个文件修改的文件暂存，然后我们提交：

```bash
git add README test.rb LICENSE
git commit -m 'The initial commit of my project'
```

> 当使用 git commit 进行提交操作时，Git 会先计算每一个子目录（本例中只有项目根目录）的校验和，然后在 Git 仓库中这些校验和保存为树对象。 随后，Git 便会创建一个提交对象，它除了包含上面提到的那些信息外，还包含指向这个树对象（项目根目录）的指针。如此一来，Git 就可以在需要的时候重现此次保存的快照。
>
> 现在，Git 仓库中有五个对象：三个 blob 对象（保存着文件快照）、一个树对象（记录着目录结构和 blob 对象索引）以及一个提交对象（包含着指向前述树对象的指针和所有提交信息）。

<img src="https://git-scm.com/book/en/v2/images/commit-and-tree.png" width=540>

做一些修改之后再次提交，那么这次提交对象会包含一个指向上一次提交对象的指针：

<img src="https://git-scm.com/book/en/v2/images/commits-and-parents.png" width=540>

```bash
# 创建分支
git branch testing
## 它相当于在当前提交上创建一个指针
#                       |- master <-- HEAD
#                       V
# 76rt1 <-- 33aiy <-- f489s
#                       ^
#                       |- testing

## 这个HEAD表示当前在哪个分支上。

# 切换分支
git checkout testing

## 新建+切换
git checkout -b testing

# 查看分支列表
git branch
## 带跟踪分支
git branch -vv

# 删除分支
git branch -d testing

# 合并分支（检出要合并到的分支，比如要合并到master）
git merge testing
```

那么问题来了，这样的方式对我们有什么好处呢，我们再提交一次看看（注意我们已经切换到`testing`分支了）：

```bash
#                       |- master
#                       V
# 76rt1 <-- 33aiy <-- f489s <-- 32be1
#                                ^
#                                |- testing <-- HEAD
````

此时，如果我们切换到master分支，那么HEAD会指向它，并且工作目录也会恢复成master分支所指向的快照内容，我们再修改下并提交（在`master`分支），此时项目的提交产生了分叉：

```bash
#                            |- master <-- HEAD
#                            V
#                       ／- a911a
#                       V
# 76rt1 <-- 33aiy <-- f489s
#                       ^
#                        \- 32be1 <-- testing
```

### 2.3.2 远程分支

`origin`和分支的`master`一样，没有特别的含义，前者是`git clone`默认的仓库名字，后者是`git init`时默认的分支名字。复制的仓库和远程仓库：

<img src="https://git-scm.com/book/en/v2/images/remote-branches-1.png" width=540>

如果有人在远程分支提交修改（`origin/master`指向了最新的位置），那么你本地如果不更新，本地的数据`origin/master`将仍然指向以前的位置：
<img src="https://git-scm.com/book/en/v2/images/remote-branches-2.png" width=540>

使用`git fetch origin`抓取本地没有的数据（注意，并不会合入／修改本地代码）：
<img src="https://git-scm.com/book/en/v2/images/remote-branches-3.png" width=540>

```bash
# 推送分支（这样别人就可以看到这个仓库里这个分支）
git push origin branch-from-jonge

# 别人检出你推送的分支
git checkout -b my-branch origin/branch-from-jonge

# 设置本地分支跟踪远程分支
git branch -u origin/branch-from-jonge

# 检出（自动跟踪）
git checkout -b new-named-branch origin/some-branch

# 删除远程分支（服务器暂时先删除指针，一段时间才会清理真正数据，所以在那之前可以恢复）
git push [remote-repository] --delete [branch-name]
```

设置了跟踪分支的话，可以直接在使用`git pull`来拉取上游跟踪分支并自动合入到当前分支。有时你可能会不小心拉取了你并不想要的分支（当前分支默认的跟踪分支），因此，最好使用`git merge [repository]/[branch]`来 **“拉取”** 代码。

> 分支开发流（分支策略）等高级操作，参考[git pro book#分支工作流](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E5%BC%80%E5%8F%91%E5%B7%A5%E4%BD%9C%E6%B5%81)。

-------
# 参考

1. git pro book: https://git-scm.com/book/zh/v2