export function helloPayGateway() {
  console.log("你好，`@ethan-utils/pay-gateway` 支付网关！");
}

// 导出类型
export type { LTZF } from "./ltzf/types.d.ts";
export type { SevenPay } from "./7pay/types.d.ts";

// 导入模块用于默认导出
import * as ltzfModule from "./ltzf/index.js";
import * as sevenPayModule from "./7pay/index.js";

// 默认导出包含所有功能
export default {
  helloPayGateway,
  ltzf: ltzfModule,
  sevenPay: sevenPayModule,
};
