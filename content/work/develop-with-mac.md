-----------------------
title: Mac 开发环境配置
date: 2011-12-22
summary: 入手 Mac 之后的开发环境配置相关。
folder: work
tags: Mac, git, GitHub
---------------------

我购买 Mac 的原因很简单，因为它拥有一个优雅稳定的系统以及强大的 Unix 环境。

包管理工具
----------

我选择 [Homebrew] [1] 作为包管理工具，基于 Ruby 编写的 Homebrew formula 可以轻松定制软件包，采用 git 进行更新和同步自身。需要注意的时，使用 [Homebrew] [1] 需要安装 Xcode 。

使用命令

```bash
ruby -e "$(curl -fsSLk https://gist.github.com/raw/323731/install_homebrew.rb)"
```

就可以直接安装。

关于软件安装位置以及与系统自带软件的冲突问题，我的做法是使用 [Homebrew] [1] 的默认设置，然后把

```bash
export PATH="/usr/local/bin:/usr/local/sbin:$PATH"
```

加入 .bashrc 或者 .zshrc 即可使用 [Homebrew] [1] 安装的软件。

Git & GitHub
------------

有了包管理工具，首先要安装的就是 git ，我的配置文件等等都放在 [GitHub] [2] 上，无论何时何地，通过 git 就可以恢复对系统和软件的各项配置。

使用命令

```bash
brew install git
```

再结合之前对 .bashrc 或者 .zshrc 的修改，运行 git 时就会调用安装的最新版本。

[GitHub] [2] 有 Mac 下的管理工具 [GitHub for Mac](http://mac.github.com/) ，不过对于习惯命令行方式的人来说可能用处不是很大。

Shell
-----

我使用 zsh ，通过 `brew` 命令进行安装，使用命令 chsh 修改默认 shell 即可。zsh 默认配置一般，需要进行调教才能符合需求，推荐使用 [oh-my-zsh](http://github.com/robbyrussell/oh-my-zsh) 来方便配置。

Vim & Emacs
-----------

我目前使用 [MacVim](http://code.google.com/p/macvim/) ，因为我在 Ubuntu 下的 Emacs 配置文件不适合 Mac 的键位，需要参考 Github 上他人提供的方案再选择。

我的 Vim 的配置文件在 [这里](http://github.com/thcode/vimrc) ，会保持更新。

Ruby
----

虽然在 Mac OS X 上 Ruby 已经成为系统默认安装的工具，但是 lion 中的版本还是 1.8.7 。为了跟上社区开发的进度，避免使用 gem 时出现某些莫名其妙的问题，安装最新版本还是很有必要的。由于 Xcode 4.2 中已经使用 llvm 替代了原版的 gcc ，无法直接使用 [Homebrew] [1] 安装 Ruby ， [RVM] [3] 就成为了一个更好的选择。

安装 [RVM] [3] 的方法很简单

```bash
bash -s stable < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)
```

然后在 .bashrc 或者 .zshrc 中加入

```bash
source /Users/username/.rvm/scripts/rvm
```

就可以使用了。

[1]: http://mxcl.github.com/homebrew/ "Homebrew"
[2]: http://github.com/
[3]: http://beginrescueend.com/
