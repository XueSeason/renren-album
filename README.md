# 人人网相册获取

## 前提

所有环境均在 OS X 下操作，不保证 Windows 的兼容性（如果 windows 中无法弹出验证码，可以在 locals 目录下查看）。

因为使用了最新的 async/await 特性，所以 node 版本必须大于等于 7.6.0

## 使用方法

```bash
# 登录操作
./app.js -l -u 49****94@qq.com -p *****

# 下载本人相册
./app.js -d

# 下载指定用户 id 相册
./app.js -d -i 4413**450

# 下载指定关键词相片，并指定数量
./app.js -k 葫芦娃 -n 40
```

相关内容保存在项目目录下的 locals 文件夹内。

> 如何知道用户id ？
> 打开用户首页，链接地址形如 `http://www.renren.com/4413**450/profile`，中间的数字就是用户 id

详情查看帮助 `./app.js -h`

```bash
  Usage: app [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -l, --login              login renren
    -d, --download           download album
    -u, --username [string]  append username
    -p, --password [string]  append password
    -k, --keyword [string]   append keyword
    -n, --number [number]    the number of keyword images you want to download, default 10
    -i, --userid [string]    specify download someone's album by user id
```

## 错误信息

登录返回错误码参考

- -1: "登录成功"
- 0: "登录系统错误，请稍后尝试"
- 1: "您的用户名和密码不匹配"
- 2: "您的用户名和密码不匹配"
- 4: "您的用户名和密码不匹配"
- 8: "请输入帐号，密码"
- 16: "您的帐号被停止使用"
- 32: "帐号未激活，请激活帐号"
- 64: "帐号已经注销"
- 128: "您的用户名和密码不匹配"
- 512: "请您输入验证码"
- 4096: "登录系统错误，稍后尝试"
- 8192: "您的用户名和密码不匹配"
- 16384: "网络不给力，请稍候重试"