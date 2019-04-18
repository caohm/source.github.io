# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

export DOCKER_ROOT := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# 设置agent版本号
export AGENT_VER := 6.0.0-GA
# 设置agent上海时区版本
export AGENT_TIMEZONE_VER := $(AGENT_VER)-timezone
# 设置仓库地址
export DOCKER_REGISTRY := 172.20.29.2:5000

oap:
	cd $(DOCKER_ROOT); \
	cd oap; \
	docker build -t apache/skywalking-oap-server:$(AGENT_VER) .; \
	docker tag apache/skywalking-oap-server:$(AGENT_VER) $(DOCKER_REGISTRY)/apache/skywalking-oap-server:$(AGENT_VER); \
	docker push $(DOCKER_REGISTRY)/apache/skywalking-oap-server:$(AGENT_VER);

oap_patch:
	cd $(DOCKER_ROOT); \
	cd oap-patch; \
	docker build -t apache/skywalking-oap-server:$(AGENT_TIMEZONE_VER) .; \
	docker tag apache/skywalking-oap-server:$(AGENT_TIMEZONE_VER) $(DOCKER_REGISTRY)/apache/skywalking-oap-server:$(AGENT_TIMEZONE_VER); \
	docker push $(DOCKER_REGISTRY)/apache/skywalking-oap-server:$(AGENT_TIMEZONE_VER);

ui:
	cd $(DOCKER_ROOT); \
	cd ui; \
	docker build -t apache/skywalking-ui:$(AGENT_VER) .; \
	docker tag apache/skywalking-ui:$(AGENT_VER) $(DOCKER_REGISTRY)/apache/skywalking-ui:$(AGENT_VER); \
	docker push $(DOCKER_REGISTRY)/apache/skywalking-ui:$(AGENT_VER);

ui_patch:
	cd $(DOCKER_ROOT); \
	cd ui-patch; \
	docker build -t apache/skywalking-ui:$(AGENT_TIMEZONE_VER) .; \
	docker tag apache/skywalking-ui:$(AGENT_TIMEZONE_VER) $(DOCKER_REGISTRY)/apache/skywalking-ui:$(AGENT_TIMEZONE_VER); \
	docker push $(DOCKER_REGISTRY)/apache/skywalking-ui:$(AGENT_TIMEZONE_VER);
	


build: oap ui 
build_patch: oap_patch ui_patch

.PHONY: oap ui oap_patch ui_patch