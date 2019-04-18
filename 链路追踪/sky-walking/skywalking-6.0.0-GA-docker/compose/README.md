
# 修改点
修改 config/elasticsearch.yml
修改 config/application.yml es ip 需要是物理IP 

# 运行
1. 依赖elasticsearch
```bash
docer-compose -d up
```
2. 依赖h2
```bash
docker-compose -c docker-compose-h2.yml -d up
```
