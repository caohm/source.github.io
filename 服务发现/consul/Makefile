export ROOT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

start_consul:
	docker run --rm -d -e 'CONSUL_ALLOW_PRIVILEGED_PORTS=' consul agent -server -bind=172.17.0.2 -client 172.17.0.2  -bootstrap-expect=1 -dns-port=53 -recursor=8.8.8.8 -ui
	docker run --rm -d -e CONSUL_BIND_INTERFACE=eth0 consul agent -dev -join=172.17.0.2
	docker run --rm -d -e CONSUL_BIND_INTERFACE=eth0 consul agent -dev -join=172.17.0.2
#	sudo echo "nameserver 172.17.0.2" >> /etc/resolv.conf




.PHONY: start_consul