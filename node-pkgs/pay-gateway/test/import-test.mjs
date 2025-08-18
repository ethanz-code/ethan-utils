// 测试新的导入方式
console.log("=== 新导入方式测试 ===");

try {
  // 测试从主包导入 ltzf
  console.log("\n1. 测试 import { ltzf } from '@ethan-utils/pay-gateway':");
  const { ltzf } = await import("@ethan-utils/pay-gateway");
  console.log("✅ ltzf 模块导入成功");
  console.log("导出的内容:", Object.keys(ltzf));

  if (ltzf.setLtzfApiConfig) {
    console.log("✅ setLtzfApiConfig 函数存在");
  } else {
    console.log("❌ setLtzfApiConfig 函数不存在");
  }
} catch (error) {
  console.error("❌ ltzf 模块导入失败:", error.message);
}

try {
  // 测试从主包导入 sevenPay
  console.log("\n2. 测试 import { sevenPay } from '@ethan-utils/pay-gateway':");
  const { sevenPay } = await import("@ethan-utils/pay-gateway");
  console.log("✅ sevenPay 模块导入成功");
  console.log("导出的内容:", Object.keys(sevenPay));

  if (sevenPay.setSevenPayApiConfig) {
    console.log("✅ setSevenPayApiConfig 函数存在");
  } else {
    console.log("❌ setSevenPayApiConfig 函数不存在");
  }
} catch (error) {
  console.error("❌ sevenPay 模块导入失败:", error.message);
}

console.log("\n=== 测试结束 ===");
