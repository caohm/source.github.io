
export DOCKER_ROOT := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

a:
	docker build -t skywalking-app/project-a:latest .
b:
	docker build -t skywalking-app/project-b:latest .
c:
	docker build -t skywalking-app/project-c:latest .

build: a b c

.PHONY: a b c
