// ESM 测试文件
console.log("=== ESM 测试开始 ===");

try {
  // 测试主模块导入
  console.log("\n1. 测试主模块导入:");
  const { helloPayGateway } = await import("../dist/index.js");
  console.log("✅ 主模块导入成功");
  helloPayGateway();
} catch (error) {
  console.error("❌ 主模块导入失败:", error.message);
}

try {
  // 测试 ltzf 子模块导入
  console.log("\n2. 测试 ltzf 子模块导入:");
  const { setLtzfApiConfig: _setLtzfApiConfig } = await import(
    "../dist/pay/ltzf.js"
  );
  console.log("✅ ltzf 子模块 setLtzfApiConfig 导入成功");

  const ltzf = await import("../dist/pay/ltzf.js");
  console.log("✅ ltzf 子模块整体导入成功");
  console.log(
    "ltzf 模块包含的函数:",
    Object.keys(ltzf).filter((key) => typeof ltzf[key] === "function"),
  );
} catch (error) {
  console.error("❌ ltzf 子模块导入失败:", error.message);
}

try {
  // 测试 7pay 子模块导入
  console.log("\n3. 测试 7pay 子模块导入:");
  const { setSevenPayApiConfig: _setSevenPayApiConfig } = await import(
    "../dist/pay/sevenPay.js"
  );
  console.log("✅ 7pay 子模块 setSevenPayApiConfig 导入成功");

  const sevenPay = await import("../dist/pay/sevenPay.js");
  console.log("✅ 7pay 子模块整体导入成功");
  console.log(
    "7pay 模块包含的函数:",
    Object.keys(sevenPay).filter((key) => typeof sevenPay[key] === "function"),
  );
} catch (error) {
  console.error("❌ 7pay 子模块导入失败:", error.message);
}

console.log("\n=== ESM 测试结束 ===");
