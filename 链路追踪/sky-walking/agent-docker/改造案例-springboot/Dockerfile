FROM frolvlad/alpine-oraclejdk8:slim
#FROM openjdk:8-jre-alpine
#FROM openjdk:8u181-jdk-stretch

ADD hello-world-0.0.1-SNAPSHOT.jar app.jar

RUN sh -c 'touch app.jar'

EXPOSE 8080

# 添加链路追踪agent
ADD agent agent
# 设置链路追踪的项目名称
ENV SW_AGENT_NAME hello-world
# 设置链路追踪的收集服务地址
ENV SW_AGENT_COLLECTOR_BACKEND_SERVICES 172.20.136.8:31180
# 启动脚本加载链路追踪agent，并设置上海时区
ENTRYPOINT ["java", "-Duser.timezone=Asia/Shanghai", "-javaagent:/agent/skywalking-agent.jar", "-jar", "app.jar"]



