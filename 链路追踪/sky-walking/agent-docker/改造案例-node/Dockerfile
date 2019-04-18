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

# Redis地址
ENV REDIS_HOST 172.20.136.8
# Redis端口
ENV REDIS_PORT 6379
# RabbiMQ地址
ENV AMQP_HOST 172.20.136.8
# RabbitMQ端口
ENV AMQP_PORT 5672
# BOSS SERVER地址
ENV BOSS_URL 'http://172.20.136.8:3030'
# GATWAY SERVER地址
ENV GATEWAY_URL 'http://172.20.136.8:3030'
# RabbitMQ服务地址
#ENV AMQP_SERVICE rabbitmq.service.consul

# -----------   SkyAMP    ---------------------
# 设置链路追踪的项目名称
ENV SW_AGENT_NAME hello-node
# 设置链路追踪的收集服务地址
ENV SW_AGENT_COLLECTOR_BACKEND_SERVICES 172.20.136.8:31180

CMD [ "npm", "start" ]