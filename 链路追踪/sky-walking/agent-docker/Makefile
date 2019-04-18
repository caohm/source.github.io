# -----------------------------------------------------------------
# Paramters
export DOCKER_ROOT := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# 构建镜像版本
export AGENT_VER = latest
# docker镜像仓库地址
export DOCKER_REGISTRY = 172.20.29.2:5000
# oap服务地址　
export COLLECTOR_BACKEND_SERVICES = 172.20.136.8:31180


# -------------------------------------------------------------------
# ngcp-uus
ngcp-uus:
	cd $(DOCKER_ROOT)/ngcp-uus; \
	mkdir -p agent;\
	tar -zxf ../skywalking-agent.tar.gz -C agent; \
	./pre.sh;\
	docker build -t ngcp-uus-skywalking:$(AGENT_VER) .; \
    rm -rf agent;\
	docker tag ngcp-uus-skywalking:$(AGENT_VER) $(DOCKER_REGISTRY)/ngcp-uus-skywalking:$(AGENT_VER); \
	docker push $(DOCKER_REGISTRY)/ngcp-uus-skywalking:$(AGENT_VER); \
	rm -rf skywalking-agent.tar.gz

# npcp-auth
ngcp-auth:
	cd $(DOCKER_ROOT)/ngcp-auth; \
	mkdir -p agent;\
	tar -zxf ../skywalking-agent.tar.gz -C agent; \
	./pre.sh;\
	docker build -t ngcp-auth-skywalking:$(AGENT_VER) .; \
    rm -rf agent;\
	docker tag ngcp-auth-skywalking:$(AGENT_VER) $(DOCKER_REGISTRY)/ngcp-auth-skywalking:$(AGENT_VER); \
	docker push $(DOCKER_REGISTRY)/ngcp-auth-skywalking:$(AGENT_VER); \
	rm -rf skywalking-agent.tar.gz

# -------------------------------------------------------------------
# 测试
# -------------------------------------------------------------------
# 测试java日志增强
test-elog:
	cd $(DOCKER_ROOT)/ngcp-auth; \
	mkdir -p agent;\
	tar -zxf ../skywalking-agent.tar.gz -C agent; \
	./pre.sh; \
    docker build -t test-hello-world .; \
    rm -rf agent;\
    docker run --rm -p 8881:8080 -e SW_AGENT_COLLECTOR_BACKEND_SERVICES=$(COLLECTOR_BACKEND_SERVICES) -it test-hello-world; \
	docker rmi test-hello-world;

# 测试Java版agent
test-java:
	cd $(DOCKER_ROOT)/改造案例; \
    mvn clean package -Dmaven.test.skip=true; \
    mv target/*.jar .; \
    docker build -t test-hello-world .; \
    docker run --rm -p 8882:8080 -e SW_AGENT_COLLECTOR_BACKEND_SERVICES=$(COLLECTOR_BACKEND_SERVICES) -it test-hello-world; \
#    docker rmi test-hello-world

# 测试NodeJS版agent
LOCAL_HOST = 100.100.100.126
COLLECTOR_BACKEND_SERVICES = $(LOCAL_HOST):11800
REDIS_HOST =$(LOCAL_HOST)
REDIS_PORT = 6379
AMQP_HOST = $(LOCAL_HOST)
AMQP_PORT = 5672
test-node:
#    docker run --rm --name redis-server  --network host -p $(REDIS_PORT) -d redis:5;
#	docker run --rm --name rabbit-server --network host -p $(AMQP_PORT)  -d rabbitmq:3.7;
	cd $(DOCKER_ROOT)/改造案例-node; \
    docker build -t test-hello-world .; \
    docker run --rm -p 8883:3000 \
    	-e SW_AGENT_COLLECTOR_BACKEND_SERVICES=$(COLLECTOR_BACKEND_SERVICES) \
    	-e REDIS_HOST=$(REDIS_HOST) \
    	-e REDIS_PORT=$(REDIS_PORT) \
    	-e AMQP_HOST=$(AMQP_HOST) \
    	-e AMQP_PORT=$(AMQP_PORT) \
     	-it test-hello-world; \
    docker rmi test-hello-world





# 构建
build: ngcp-uus ngcp-auth

# 全新构建，忽略已有的构建文件
.PHONY: ngcp-uus ngcp-auth test-elog test-java test-node
