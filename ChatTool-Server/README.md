# ChatTool-Server

模仿微信聊天室的Nodejs程序

## 技术栈

Nodejs + Mongoose + JsonWebToken + Socket.io

## 项目启动

```bash
npm install
npm run dev
```

## 项目测试

```
npm run test
```

## 任务清单

- [x] 使用jsonwebtoken+passport+passport-http-bearer，做一个不记名认证，如果超出设定时间，token失效，需要重新登录。
- [x] 使用morgan模块，记录日志
- [x] 使用cross-env模块，区分项目运行环境
- [x] 响应头以及压缩需要关注？
- [ ] csrf跨站请求攻击如何避免？
- [ ] cluster集群如何实现？
- [x] socket.io 区分聊天室，room的概念？
- [ ] steam流的概念，优化缓存，二进制 Buffer
- [ ] mocha测试模块开发
- [ ] 利用百度和腾讯的地理信息api做定位处理
- [x] 错误异常处理 http-errors errorhandler
