# @ethan-utils/pay-gateway 使用说明

## 目录

- [7Pay 用法](#7pay-用法)
- [ltzf（蓝兔支付）用法](#ltzf蓝兔支付用法)
- [常见问题](#常见问题)

---

## 7Pay 用法

### 1. 初始化配置

```ts
import { sevenPay } from "@ethan-utils/pay-gateway";

sevenPay.setSevenPayApiConfig({
  baseURL: "https://api.7pay.cc",
  key: "你的商户密钥",
  pid: "你的商户ID",
  notify_url: "https://你的域名/notify",
  return_url: "https://你的域名/return",
  timeout: 10000, // 可选，单位毫秒
  log: true, // 可选，是否输出日志
});
```

### 2. 跳转支付

```ts
import { sevenPay } from "@ethan-utils/pay-gateway";

const url = sevenPay.jumpPay({
  out_trade_no: "订单号",
  type: "alipay", // 支付类型
  name: "商品名称",
  money: 100,
});
// 跳转到 url 即可发起支付
```

### 3. API 支付

```ts
import { sevenPay } from "@ethan-utils/pay-gateway";

const res = await sevenPay.apiPay({
  out_trade_no: "订单号",
  type: "alipay",
  name: "商品名称",
  money: 100,
});
```

### 4. 余额查询

```ts
import { sevenPay } from "@ethan-utils/pay-gateway";
const res = await sevenPay.balanceQuery();
```

### 5. 订单查询

```ts
import { sevenPay } from "@ethan-utils/pay-gateway";
const res = await sevenPay.orderQuery({ out_trade_no: "订单号" });
```

### 6. 退款

```ts
import { sevenPay } from "@ethan-utils/pay-gateway";
const res = await sevenPay.refund({ out_trade_no: "订单号", money: 100 });
```

### 7. 通知验签

```ts
import { sevenPay } from "@ethan-utils/pay-gateway";
const isValid = sevenPay.notify.verifyPayParams(req.body);
if (isValid) {
  // 验签通过，处理业务
} else {
  // 验签失败
}
```

---

## ltzf（蓝兔支付）用法

### 1. 初始化配置

```ts
import { ltzf } from "@ethan-utils/pay-gateway";

ltzf.setLtzfApiConfig({
  baseURL: "https://api.ltzf.com",
  key: "你的商户密钥",
  mch_id: "你的商户号",
  notifyUrl: "https://你的域名/notify",
  returnUrl: "https://你的域名/return",
  refundUrl: "https://你的域名/refund", // 可选
  developerAppid: "开发者AppID", // 可选
  timeout: 10000, // 可选
  log: true, // 可选
});
```

### 2. 扫码支付

```ts
import { ltzf } from "@ethan-utils/pay-gateway";
const res = await ltzf.scanPay({
  out_trade_no: "订单号",
  total_fee: 100,
  body: "商品描述",
});
```

### 3. H5 支付

```ts
import { ltzf } from "@ethan-utils/pay-gateway";
const res = await ltzf.h5Pay({
  out_trade_no: "订单号",
  total_fee: 100,
  body: "商品描述",
});
```

### 4. 公众号/小程序/APP 支付

```ts
import { ltzf } from "@ethan-utils/pay-gateway";

// 公众号
await ltzf.jsapiPay({
  out_trade_no: "订单号",
  total_fee: 100,
  body: "商品描述",
  openid: "用户openid",
});
// 小程序
await ltzf.miniProgramPay({
  out_trade_no: "订单号",
  total_fee: 100,
  body: "商品描述",
  openid: "用户openid",
});
// APP
await ltzf.appPay({ out_trade_no: "订单号", total_fee: 100, body: "商品描述" });
```

### 5. 退款

```ts
import { ltzf } from "@ethan-utils/pay-gateway";
await ltzf.refundOrder({
  out_trade_no: "订单号",
  out_refund_no: "退款单号",
  refund_fee: 100,
});
```

### 6. 查询订单/退款

```ts
import { ltzf } from "@ethan-utils/pay-gateway";
await ltzf.getPayOrder({ out_trade_no: "订单号" });
await ltzf.getRefundOrder({ out_refund_no: "退款单号" });
```

### 7. 通知验签

```ts
import { ltzf } from "@ethan-utils/pay-gateway";
const isPayValid = ltzf.notify.verifyPayParams(req.body);
const isRefundValid = ltzf.notify.verifyRefundParams(req.body);
if (isPayValid) {
  // 支付通知验签通过
}
if (isRefundValid) {
  // 退款通知验签通过
}
```

---

## 常见问题

- 所有接口均为 RESTful 风格，推荐在 Node.js 后端服务中调用。
- 配置初始化后无需每次传递密钥、商户号等敏感信息。
- 如需自定义签名字段过滤，可通过 `signFilter` 配置。
- 详细参数类型请参考类型定义文件。

如有更多问题，欢迎提 issue。
