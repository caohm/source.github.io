
# 目录结构
```
caohm@caohm-ThinkPad-E450:~/code/gitNeusoft/ngcp-core/tool/prod/tracing/agent-docker$ tree -L 1
.
├── apm-toolkit-log            # java日志增强库
├── Makefile                   # 构建脚本
├── ngcp-auth                  # auth服务脚本
├── ngcp-uus                   # uus服务脚本
├── README.md                  # 说明文档
├── skywalking-agent.tar.gz    # agent程序包
├── 改造案例                    # java示例程序
└── 改造案例-node               # nodejs示例程序

```


# 构建镜像

## 修改Makefile

```makefile
# 构建镜像版本
export AGENT_VER = latest
# docker镜像仓库地址
export DOCKER_REGISTRY = 172.20.29.2:5000
# oap服务地址　
export COLLECTOR_BACKEND_SERVICES = 172.20.136.8:31180
```
## 构建
run `make build` 来构建并发布镜像 

run `make test-elog` 来测试Java版agent带日志增强

run `make test-java` 来测试Java版agent

run `make test-node` 来测试NodeJS版agent

# 改造案例

## Java Agent 改造方案
参考　[改造案例/README.md](tool/prod/tracing/agent-docker/改造案例)

## NodeJS Agent 改造方案
参考　[改造案例-node/README.md](tool/prod/tracing/agent-docker/改造案例-node)

