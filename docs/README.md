# 设计文档

简易版本

## 概要设计

### 功能

#### 用户

* 登录
* 注销
* 注册

#### 购物

* 浏览与搜索
* 查看详情
* 加入购物车
* 查看购物车
* 下单、调整库存并更改物流状态

#### 物流

* 查询

#### 管理

* 录入商品
* 下架商品

### 服务

* nginx 代理 —— 前端及反向代理，采集访问日志
* shopping-system —— 购物系统，提供用户、订单、购物车功能
* warehouse —— 上下架商品，扣减库存
* delivery —— 物流系统，提供物流功能

## 详细设计

### 功能模块示意图

![](images/system.png)

### 时序图

![](images/sequence.png)

### 表结构设计

![](images/database.png)

### 接口设计

#### 注册（POST /register）

##### 请求

| 字段                  | 类型   | 描述         |
| --------------------- | ------ | ------------ |
| username              | string | 用户名       |
| password              | string | 密码         |
| password_confirmation | string | 密码二次确认 |

##### 响应

* 无

##### 请求示例

    POST /register

    {
        "username": "jerry",
        "password": "******",
        "password_confirmation": "******"
    }

##### 响应示例

空

#### 登录（POST /login）

##### 请求

| 字段        | 类型    | 描述     |
| ----------- | ------- | -------- |
| username    | string  | 用户名   |
| password    | string  | 密码     |
| remember_me | boolean | 是否记住 |

##### 响应

| 字段  | 类型   | 描述     |
| ----- | ------ | -------- |
| type  | string | 认证类型 |
| token | string | ……     |

##### 请求示例

    POST /login

    {
        "username": "jerry"
        "password": "******"
        "remember_me": true
    }

##### 响应示例

    {
        "type": "bearer",
        "token": "Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan"
    }

#### 注销（POST /logout）

#### 下单（POST /orders）

##### 请求

| 字段      | 类型                               | 描述                       |
| --------- | ---------------------------------- | -------------------------- |
| product   | array[{id: number, count: number}] | 可选，要下单的产品id及数量 |
| carts     | array[number]                      | 可选，购物车 id 列表       |
| address   | string                             | 收件地址                   |
| mobile    | string                             | 收件人手机号               |
| recipient | string                             | 收件人                     |

##### 响应

| 字段      | 类型   | 描述         |
| --------- | ------ | ------------ |
| user_id   | number | 用户id       |
| address   | string | 收件地址     |
| mobile    | string | 收件人手机号 |
| recipient | string | 收件人       |
| price     | number | 订单价格     |
| id        | number | 订单id       |

##### 错误

| 名称                    | 说明                                                       |
| ----------------------- | ---------------------------------------------------------- |
| NoValidProductException | 请求中 `product` 和 `carts` 都为空或无效，无法形成有效订单 |

##### 请求示例

    POST /orders
    Authorization: Bearer Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan

    {
        "product": [{
            "id": 1,
            "count": 1
        }],
        "carts": [],
        "address": "香港銅鑼灣威非路道18號",
        "mobile": "13488888888",
        "recipient": "KK"
    }

##### 响应示例

    {
        "user_id":1,
        "address":"香港銅鑼灣威非路道18號",
        "mobile":"13488888888",
        "recipient":"KK",
        "price":476,
        "created_at":"2021-04-05T21:56:56.441+08:00",
        "updated_at":"2021-04-05T21:56:56.469+08:00",
        "id":29
    }

#### 支付回调（PATCH /orders/:order_id/payment）

##### 请求

| 字段     | 类型   | 描述   |
| -------- | ------ | ------ |
| order_id | number | 订单id |

##### 响应

| 字段      | 类型    | 描述           |
| --------- | ------- | -------------- |
| user_id   | number  | 用户id         |
| address   | string  | 收件地址       |
| mobile    | string  | 收件人手机号   |
| recipient | string  | 收件人         |
| price     | number  | 订单价格       |
| id        | number  | 订单id         |
| pay_stat  | boolean | `true`为已支付 |

##### 示例请求

    PATCH /orders/29/payment
    Authorization: Bearer Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan

##### 示例响应

    {
        "id":29,
        "user_id":1,
        "recipient":"KK",
        "price":476,
        "address":"香港銅鑼灣威非路道18號",
        "pay_stat":true,
        "mobile":"13488888888",
        "created_at":"2021-04-05T21:56:56.000+08:00",
        "updated_at":"2021-04-05T22:07:37.925+08:00"
    }

#### 查询订单（GET /orders/:id?）

##### 请求

| 字段 | 类型   | 描述                                 |
| ---- | ------ | ------------------------------------ |
| id   | number | 订单ID，可选，没有时默认获取全部订单 |

##### 响应

订单对象数组或订单对象

| 字段      | 类型    | 描述                     |
| --------- | ------- | ------------------------ |
| user_id   | number  | 用户id                   |
| address   | string  | 收件地址                 |
| mobile    | string  | 收件人手机号             |
| recipient | string  | 收件人                   |
| price     | number  | 订单价格                 |
| id        | number  | 订单id                   |
| pay_stat  | boolean | `1`为已支付，`0`为未支付 |

##### 请求示例

    GET /orders
    Authorization: Bearer Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan

##### 响应示例

    [
        {
            "id":23,
            "user_id":1,
            "recipient":"Jerry",
            "price":6877,
            "address":"香港銅鑼灣威非路道18號",
            "pay_stat":1,
            "mobile":"13778866666",
            "created_at":"2021-04-05T19:40:08.000+08:00",
            "updated_at":"2021-04-05T19:40:13.000+08:00"
        }
    ]
#### 加入购物车（POST /carts）

##### 请求

| 字段       | 类型               | 描述   |
| ---------- | ------------------ | ------ |
| product_id | number             | 商品ID |
| count      | 要加入购物车的数量 |        |

##### 响应

| 字段       | 类型   | 描述                                 |
| ---------- | ------ | ------------------------------------ |
| id         | number | 购物车ID，区别不同购物车中的不同商品 |
| product_id | number | 商品id，对应放到购物车中的商品       |
| user_id    | number | 用户id，对应某一用户的购物车         |
| count      | number | 放到该购物车中的该商品的数量         |

##### 示例请求

    POST /api/carts
    Authorization: Bearer Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan

    {
        "product_id": 6,
        "count": 3
    }

##### 示例响应

    {
        "product_id":6,
        "user_id":1,
        "count":3,
        "created_at":"2021-04-05T22:25:25.566+08:00",
        "updated_at":"2021-04-05T22:25:25.566+08:00",
        "id":12
    }

#### 查看购物车（GET /carts）

##### 请求

* 无

##### 响应

购物车对象数组

| 字段       | 类型   | 描述                                 |
| ---------- | ------ | ------------------------------------ |
| id         | number | 购物车ID，区别不同购物车中的不同商品 |
| product_id | number | 商品id，对应放到购物车中的商品       |
| user_id    | number | 用户id，对应某一用户的购物车         |
| count      | number | 放到该购物车中的该商品的数量         |
| price      | number | 商品单价                             |
| name       | string | 商品名称                             |

##### 请求示例

    GET /carts
    Authorization: Bearer Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan

##### 响应示例

    [
        {
            "id":9,
            "user_id":1,
            "product_id":9,
            "count":3,
            "created_at":"2021-04-05T19:38:48.000+08:00",
            "updated_at":"2021-04-05T19:38:48.000+08:00",
            "name":"Tasty Soft Sausages",
            "price":995
        }
    ]
#### 清理购物车（DELETE /carts?ids=）

##### 请求

| 字段 | 类型  | 描述                        |
| ---- | ----- | --------------------------- |
| ids  | array | 要删除的购物车ID，以`,`隔开 |
##### 响应

| 字段    | 类型    | 描述                            |
| ------- | ------- | ------------------------------- |
| id      | number  | 被操作对象                      |
| deleted | boolean | 删除成功为`true`，否则为`false` |

##### 请求示例

    DELETE /carts?ids=9
##### 响应示例

    [{"id":9,"deleted":true}]

#### 浏览（GET /product?q=）

该接口由 warehouse 实际提供
##### 请求

| 字段 | 类型   | 描述     |
| ---- | ------ | -------- |
| q    | string | 模糊查询 |

##### 响应

商品对象数组

| 字段        | 类型   | 描述                         |
| ----------- | ------ | ---------------------------- |
| id          | number | 商品 ID                      |
| user_id     | number | 商家的用户ID                 |
| name        | string | 商品名称                     |
| description | string | 商品描述                     |
| price       | number | 商品单价                     |
| count       | number | 商品库存                     |
| lock_cnt    | number | 下单还未付款的数量，暂未实现 |
##### 请求示例

    GET /product
    Authorization: Bearer Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan
##### 响应示例

    [
        {
            "id":3,
            "user_id":1,
            "name":"Tasty Fresh Ball",
            "description":"New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
            "price":238,
            "count":50,
            "lock_cnt":394,
            "created_at":"2021-03-30T09:22:07.000+08:00",
            "updated_at":"2021-04-05T22:07:37.000+08:00"
        }
    ]
#### 商品详情（GET /product/:id）

该接口由 warehouse 实际提供

##### 请求

| 字段 | 类型   | 描述   |
| ---- | ------ | ------ |
| id   | number | 商品ID |
##### 响应

商品对象

| 字段        | 类型   | 描述                         |
| ----------- | ------ | ---------------------------- |
| id          | number | 商品 ID                      |
| user_id     | number | 商家的用户ID                 |
| name        | string | 商品名称                     |
| description | string | 商品描述                     |
| price       | number | 商品单价                     |
| count       | number | 商品库存                     |
| lock_cnt    | number | 下单还未付款的数量，暂未实现 |
##### 请求示例

    GET /product/3
    Authorization: Bearer Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan
##### 响应示例

    {
        "id":3,
        "user_id":1,
        "name":"Tasty Fresh Ball",
        "description":"New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
        "price":238,
        "count":50,
        "lock_cnt":394,
        "created_at":"2021-03-30T09:22:07.000+08:00",
        "updated_at":"2021-04-05T22:07:37.000+08:00"
    }

#### 查看自己上架的商品（GET /admin/product）

该接口由 warehouse 实际提供

##### 请求

* 无
##### 响应

商品对象数组

| 字段        | 类型   | 描述                         |
| ----------- | ------ | ---------------------------- |
| id          | number | 商品 ID                      |
| user_id     | number | 商家的用户ID                 |
| name        | string | 商品名称                     |
| description | string | 商品描述                     |
| price       | number | 商品单价                     |
| count       | number | 商品库存                     |
| lock_cnt    | number | 下单还未付款的数量，暂未实现 |
##### 请求示例

    GET /admin/product
##### 响应示例

    [
        {
            "id":3,
            "user_id":1,
            "name":"Tasty Fresh Ball",
            "description":"New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
            "price":238,
            "count":50,
            "lock_cnt":394,
            "created_at":"2021-03-30T09:22:07.000+08:00",
            "updated_at":"2021-04-05T22:07:37.000+08:00"
        }
    ]
#### 录入商品（POST /product）

该接口由 warehouse 实际提供

##### 请求

商品对象

| 字段        | 类型   | 描述     |
| ----------- | ------ | -------- |
| name        | string | 商品名称 |
| description | string | 商品描述 |
| count       | number | 库存量   |
| price       | number | 商品价格 |

##### 响应

商品对象

| 字段        | 类型   | 描述                         |
| ----------- | ------ | ---------------------------- |
| id          | number | 商品 ID                      |
| user_id     | number | 商家的用户ID                 |
| name        | string | 商品名称                     |
| description | string | 商品描述                     |
| price       | number | 商品单价                     |
| count       | number | 商品库存                     |
| lock_cnt    | number | 下单还未付款的数量，暂未实现 |
##### 请求示例
    
    POST /product
    Authorization: Bearer Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan

    {
        "name":"朵唯K10pro",
        "description":"新上市5G朵唯K10pro智能手机全网通5g学生价游戏水滴曲面屏千元排行榜全新老人老年适用于oppo小米鼠华为耳机",
        "count":1000,
        "price":"1269"
    }
##### 响应示例

    {
        "name":"朵唯K10pro",
        "description":"新上市5G朵唯K10pro智能手机全网通5g学生价游戏水滴曲面屏千元排行榜全新老人老年适用于oppo小米鼠华为耳机",
        "price":1269,
        "count":1000,
        "user_id":1,
        "created_at":"2021-04-05T23:14:32.969+08:00",
        "updated_at":"2021-04-05T23:14:32.969+08:00",
        "id":36
    }
#### 下线商品（DELETE /product/:id）

该接口由 warehouse 实际提供
##### 请求

| 字段 | 类型   | 描述   |
| ---- | ------ | ------ |
| id   | number | 商品ID |
##### 响应

* 无
##### 请求示例

    DELETE /product/19

##### 响应示例

空
#### 查询订单物流（GET /orders/:order_id/deliveries）

该接口由 delivery 实际提供
##### 请求

| 字段     | 类型   | 描述   |
| -------- | ------ | ------ |
| order_id | number | 订单ID |
##### 响应

| 字段          | 类型                                | 描述         |
| ------------- | ----------------------------------- | ------------ |
| id            | number                              | 物流ID       |
| order_form_id | number                              | 订单ID       |
| address       | string                              | 收件地址     |
| mobile        | string                              | 收件人手机号 |
| detail        | array[{step: string, time: string}] | 物流详情     |
##### 请求示例

    GET /orders/23/deliveries
    Authorization: Bearer Y2tuNG5wNmdwMDAwNjBscXRkeG10NjFvag.TZQ8Z0e3w2Oxooldq1WqgFiu2W__SW-F8QJrulr3pPC4clBEDorxNqPasyan
##### 响应示例

    [
        {
            "id":9,
            "order_form_id":23,
            "username":"Jerry",
            "address":"香港銅鑼灣威非路道18號",
            "mobile":"13778866666",
            "detail":"[{"step": "正在出库", "time": "2021-04-05T11:40:13.894Z"}]",
            "created_at":"2021-04-05T19:40:13.000+08:00",
            "updated_at":"2021-04-05T19:40:13.000+08:00"
        }
    ]
### 异步任务

1. 减库存——warehouse
2. 更改物流状态——delivery
