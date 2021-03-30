# Shopping System

[设计文档](docs/design.md)

## 项目目录

* portal —— 前端，Nginx 部署
* shopping —— 购物系统后端服务，带认证
* delivery —— 物流系统
* warehouse —— 仓储系统

## 运行

```sh
make start
open http://localhost:5267
```

## 日志采集

采集 nginx 访问日志，用于审计
