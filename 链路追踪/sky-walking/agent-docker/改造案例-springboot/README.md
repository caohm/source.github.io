# 现有项目支持链路追踪文档

# 改造案例

# 编辑Dockerfile

```dockerfile
FROM frolvlad/alpine-oraclejdk8:slim

ADD hello-world-0.0.1-SNAPSHOT.jar app.jar

RUN sh -c 'touch app.jar'

# 添加链路追踪agent
ADD agent agent
# 设置链路追踪的项目名称
ENV SW_AGENT_NAME=hello-world
# 设置链路追踪的收集服务地址
ENV SW_AGENT_COLLECTOR_BACKEND_SERVICES=172.20.136.8:31180
# 启动脚本加载链路追踪agent，并设置上海时区
ENTRYPOINT ["java", "-Duser.timezone=Asia/Shanghai", "-javaagent:/agent/skywalking-agent.jar", "-jar", "app.jar"]
```

增加语句**`ADD agent agent`**，添加链路追踪的agent目录。

增加环境变量**`ENV SW_AGENT_NAME=hello-world`**设置链路追踪的项目名称

增加环境变量**`ENV SW_AGENT_COLLECTOR_BACKEND_SERVICES=172.20.136.8:31180`**设置链路追踪的收集服务地址

编辑启动脚本设置时区**`"-Duser.timezone=Asia/Shanghai"`**，程序使用上海时区，如果已经是上海时区请忽略。

编辑启动脚本增加agent**`"-javaagent:/agent/skywalking-agent.jar"`**，程序启动时加载链路追踪相关代码。


# 运行效果
```
DEBUG 2019-04-12 16:36:07:116 AgentPackagePath :  The beacon class location is jar:file:/agent/skywalking-agent.jar!/org/apache/skywalking/apm/agent/core/boot/AgentPackagePath.class. 
INFO 2019-04-12 16:36:07:117 SnifferConfigInitializer :  Config file found in /agent/config/agent.config. 

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v2.1.3.RELEASE)

2019-04-12 16:36:11.870  INFO 1 --- [           main] c.e.helloworld.HelloWorldApplication     : Starting HelloWorldApplication v0.0.1-SNAPSHOT on 70136a2bd47e with PID 1 (/app.jar started by root in /)
2019-04-12 16:36:11.885  INFO 1 --- [           main] c.e.helloworld.HelloWorldApplication     : No active profile set, falling back to default profiles: default
2019-04-12 16:36:15.676  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2019-04-12 16:36:15.763  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2019-04-12 16:36:15.764  INFO 1 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.16]
2019-04-12 16:36:15.785  INFO 1 --- [           main] o.a.catalina.core.AprLifecycleListener   : The APR based Apache Tomcat Native library which allows optimal performance in production environments was not found on the java.library.path: [/usr/java/packages/lib/amd64:/usr/lib64:/lib64:/lib:/usr/lib]
2019-04-12 16:36:15.961  INFO 1 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2019-04-12 16:36:15.961  INFO 1 --- [           main] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 3670 ms
2019-04-12 16:36:16.504  INFO 1 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
2019-04-12 16:36:17.042  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2019-04-12 16:36:17.052  INFO 1 --- [           main] c.e.helloworld.HelloWorldApplication     : Started HelloWorldApplication in 7.21 seconds (JVM running for 10.068)
2019-04-12 16:36:29.725  INFO 1 --- [nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2019-04-12 16:36:29.725  INFO 1 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2019-04-12 16:36:29.768  INFO 1 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 43 ms
```