# @ethan-utils/pay-gateway

本包为多支付网关工具包，支持 7Pay、蓝兔支付（ltzf）等第三方支付平台的统一接入，适用于 Node.js 环境。

## 功能清单

### 7Pay 支付

- `setSevenPayApiConfig(config)`：初始化 7Pay 配置
- `jumpPay(params)`：生成跳转支付 URL
- `apiPay(params)`：API 接口支付（POST）
- `balanceQuery()`：余额查询
- `orderQuery(params)`：订单查询
- `refund(params)`：退款
- `notify.verifyPayParams(params)`：支付结果通知验签

### 蓝兔支付（ltzf）

- `setLtzfApiConfig(config)`：初始化 ltzf 配置
- `signParams(params)`：参数签名
- `notify.verifyPayParams(params)`：支付通知验签
- `notify.verifyRefundParams(params)`：退款通知验签
- `scanPay(params)`：扫码支付
- `h5Pay(params)`：H5 支付
- `h5JumpPay(params)`：H5 跳转支付
- `jsapiPay(params)`：公众号 JSAPI 支付
- `jsapiConvenientPay(params)`：公众号便捷版支付
- `appPay(params)`：APP 支付
- `miniProgramPay(params)`：小程序支付
- `refundOrder(params)`：订单退款
- `getWechatOpenid(params)`：获取微信 Openid
- `getPayOrder(params)`：查询订单
- `getRefundOrder(params)`：查询退款

## 依赖

- [@ethan-utils/axios](https://www.npmjs.com/package/@ethan-utils/axios)
- [crypto-js](https://www.npmjs.com/package/crypto-js)

## 安装

```sh
pnpm add @ethan-utils/pay-gateway
```

## 快速开始

### 导入方式

```ts
// 导入 ltzf 支付模块
import { ltzf } from "@ethan-utils/pay-gateway";

// 导入 7Pay 支付模块
import { sevenPay } from "@ethan-utils/pay-gateway";

// 同时导入两个模块
import { ltzf, sevenPay } from "@ethan-utils/pay-gateway";
```

### 基本用法

```ts
// 初始化 ltzf 配置
ltzf.setLtzfApiConfig({
  baseURL: "https://api.ltzf.com",
  key: "你的商户密钥",
  mch_id: "你的商户号",
  notifyUrl: "https://你的域名/notify",
  returnUrl: "https://你的域名/return",
});

// 发起扫码支付
const result = await ltzf.scanPay({
  out_trade_no: "订单号",
  total_fee: 100,
  body: "商品描述",
});
```

请参考 [USAGE.md](./USAGE.md) 获取详细用法和参数说明。

---

如有问题欢迎提 issue。
