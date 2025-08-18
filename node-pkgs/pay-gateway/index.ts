export function helloPayGateway() {
  console.log("你好，`@ethan-utils/pay-gateway` 支付网关！");
}

// 重新导出 ltzf 相关功能
export * as ltzf from "./ltzf/index.js";

// 重新导出 7pay 相关功能
export * as sevenPay from "./7pay/index.js";
