# 现有项目支持链路追踪文档

# 改造案例

# NodeJS Agent

GitHub: [SkyAPM-nodejs.git](https://github.com/SkyAPM/SkyAPM-nodejs)

## package.json 
```json
{
  "name": "open-gateway",
  "version": "1.0.0-alpha",
  "description": "open api gateway for backend services",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "mock": "node test/mock.js",
    "queue": "node test/receive.js"
  },
  "author": "Xiaoyu.DAI (daixy@neusoft.com)",
  "license": "ISC",
  "dependencies": {
    "amqplib": "^0.4.2",
    "body-parser": "^1.18.1",
    "cache-service": "^1.3.8",
    "cache-service-node-cache": "^1.1.1",
    "cache-service-redis": "^1.2.3",
    "cookie-parser": "^1.4.3",
    "express": "^4.15.4",
    "express-validator": "^2.21.0",
    "finalhandler": "^0.5.1",
    "http-auth": "^2.4.11",
    "ipaddr.js": "^1.5.2",
    "morgan": "^1.8.2",
    "node-fetch": "^1.7.3",
    "redis": "^2.8.0",
    "serve-favicon": "^2.4.4",
    "uuid": "^2.0.3",
    "skyapm-nodejs": "^1.1.2"
  },
  "repository": {
    "type": "git",
    "url": "http://192.168.131.211:7777/ngopen/ngopen-opgw.git"
  },
  "devDependencies": {}
}
```

dependencies节点增加`"skyapm-nodejs": "^1.1.2"`的依赖

## aap.js 增加引用　

```js
require("skyapm-nodejs").start({
    serviceName: process.env.SW_AGENT_NAME || "hello-node",
    directServers: process.env.SW_AGENT_COLLECTOR_BACKEND_SERVICES || '172.20.136.8:31180'
});
```

## 编辑Dockerfile

```dockerfile
FROM node:6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

RUN mkdir -p /usr/src/app/lib
RUN mkdir -p /usr/src/app/etc
RUN mkdir -p /usr/src/app/public
COPY lib/** /usr/src/app/lib/
COPY etc/** /usr/src/app/etc/
COPY public/** /usr/src/app/public/
COPY app.js /usr/src/app

ENV PORT0 3000
EXPOSE $PORT0

# 设置链路追踪的项目名称
ENV SW_AGENT_NAME hello-node
# 设置链路追踪的收集服务地址
ENV SW_AGENT_COLLECTOR_BACKEND_SERVICES 172.20.136.8:31180

CMD [ "npm", "start" ]
```

增加环境变量**`ENV SW_AGENT_NAME=hello-node`**设置链路追踪的项目名称

增加环境变量**`ENV SW_AGENT_COLLECTOR_BACKEND_SERVICES=172.20.136.8:31180`**设置链路追踪的收集服务地址

