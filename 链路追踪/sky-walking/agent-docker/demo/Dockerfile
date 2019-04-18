FROM openjdk:8-jre-alpine

ADD target/demo-0.0.1-SNAPSHOT.jar app.jar

RUN sh -c 'touch /app.jar'

ADD agent agent

EXPOSE 8080

ENV SW_AGENT_NAME project
ENV SW_AGENT_COLLECTOR_BACKEND_SERVICES 192.168.112.98:31180


ENTRYPOINT ["java",\
 "-javaagent:/agent/skywalking-agent.jar", \
 "-jar","/app.jar", "--server.port=8080" ]
