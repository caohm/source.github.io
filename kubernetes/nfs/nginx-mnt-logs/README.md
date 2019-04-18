


# via mount 本地

caohm@caohm-ThinkPad-E450:~/code/github/caohm/source.github.io/kubernetes/nfs/nginx-mnt-logs$ service nfs-server start

caohm@caohm-ThinkPad-E450:~/code/github/caohm/source.github.io/kubernetes/nfs/nginx-mnt-logs$ sudo mount -t nfs 192.168.172.179:/export/nfs mnt

caohm@caohm-ThinkPad-E450:~/code/github/caohm/source.github.io/kubernetes/nfs/nginx-mnt-logs$ docker-compose --file docker-compose-xlua.yml up 


caohm@caohm-ThinkPad-E450:~/code/github/caohm/source.github.io/kubernetes/nfs/nginx-mnt-logs$ docker run --rm -d  -v /home/caohm/code/github/caohm/source.github.io/kubernetes/nfs/nginx-mnt-logs/mnt/logs:/opt/nginx/logs -v /home/caohm/code/github/caohm/source.github.io/kubernetes/nfs/nginx-mnt-logs/mnt/conf:/opt/nginx/conf 172.20.27.7:5000/default/xlua:b

sudo vi /etc/exports

exportfs -rv

sudo showmount -e

sudo umount -v mnt



# via docker-volume-netshare


caohm@caohm-ThinkPad-E450:~$ service docker-volume-netshare start
caohm@caohm-ThinkPad-E450:~$ sudo service nfs-server start
caohm@caohm-ThinkPad-E450:~$ docker version
Client:
 Version:           18.09.4
 API version:       1.39
 Go version:        go1.10.8
 Git commit:        d14af54266
 Built:             Wed Mar 27 18:35:44 2019
 OS/Arch:           linux/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          18.09.4
  API version:      1.39 (minimum version 1.12)
  Go version:       go1.10.8
  Git commit:       d14af54
  Built:            Wed Mar 27 18:01:48 2019
  OS/Arch:          linux/amd64
  Experimental:     false
caohm@caohm-ThinkPad-E450:~$ sudo docker-volume-netshare nfs -a 1.39


caohm@caohm-ThinkPad-E450:/export/nfs$ docker run --rm -d  --volume-driver=nfs -v localhost/export/nfs/logs:/opt/nginx/logs -v localhost/export/nfs/conf:/opt/nginx/conf 172.20.27.7:5000/default/xlua:b

caohm@caohm-ThinkPad-E450:/export/nfs$ docker run --rm -d  --volume-driver=nfs -v localhost/export/nfs/logs:/opt/nginx/logs -v localhost/export/nfs/conf:/opt/nginx/conf 172.20.27.7:5000/default/xlua:b

caohm@caohm-ThinkPad-E450:/export/nfs$ docker run --rm -d  --volume-driver=nfs -v 192.168.172.179/export/nfs/logs:/opt/nginx/logs -v 192.168.172.179/export/nfs/conf:/opt/nginx/conf 172.20.27.7:5000/default/xlua:b

caohm@caohm-ThinkPad-E450:/export/nfs$ docker run --rm -d  --volume-driver=nfs -v 192.168.172.179/export/nfs/logs:/opt/nginx/logs -v 192.168.172.179/export/nfs/conf:/opt/nginx/conf 172.20.27.7:5000/default/xlua:b





# 参考文档

## docker with nfs

https://docs.docker.com/samples/library/nginx/

https://github.com/ContainX/docker-volume-netshare

https://www.cnblogs.com/iiiiher/p/7988803.html 

https://www.jianshu.com/p/238cb3f50e55

## nginx build 

https://www.cnblogs.com/dtiove/p/5924385.html

http://nginx.org/en/docs/configure.html
https://www.cnblogs.com/firadio/p/6158204.html
https://www.cnblogs.com/zhangge123/p/6597745.html