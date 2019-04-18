


# 修改Makefile

```makefile
# 设置agent镜像版本号
export AGENT_VER := 6.0.0-GA
# 设置agent镜像上海时区版本
export AGENT_TIMEZONE_VER := $(AGENT_VER)-timezone
# 设置仓库地址
export DOCKER_REGISTRY := 172.20.29.2:5000

```

# 构建镜像

run `make build` 来构建镜像

run `make build_patch` 来构建上海时区的镜像

## 导出镜像

docker save -o sky-working-6.0-GA/elasticsearch-6.3.2.tar docker.elastic.co/elasticsearch/elasticsearch:6.3.2 

## 导入镜像 

docker load -i sky-working-6.0-GA/elasticsearch-6.3.2.tar



