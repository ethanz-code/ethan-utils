export function helloPayGateway() {
  console.log("你好，`@ethan-utils/pay-gateway` 支付网关！");
}

// 重新导出 ltzf 相关功能
export * as ltzf from "./ltzf/index.js";

// 重新导出 7pay 相关功能
export * as sevenPay from "./7pay/index.js";

// 导入模块用于默认导出
import * as ltzfModule from "./ltzf/index.js";
import * as sevenPayModule from "./7pay/index.js";

// 默认导出包含所有功能
export default {
  helloPayGateway,
  ltzf: ltzfModule,
  sevenPay: sevenPayModule,
};
