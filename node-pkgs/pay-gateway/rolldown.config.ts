import { defineConfig } from "rolldown";

export default defineConfig([
  // ESM build
  {
    input: {
      index: "./index.ts",
      "pay/sevenPay": "./7pay/index.ts",
      "pay/ltzf": "./ltzf/index.ts",
    },
    output: {
      format: "esm",
      dir: "dist",
      minify: true,
      entryFileNames: "[name].js",
    },
    external: ["@ethan-utils/axios", "crypto-js"],
  },
  // CommonJS build
  {
    input: {
      index: "./index.ts",
      "pay/sevenPay": "./7pay/index.ts",
      "pay/ltzf": "./ltzf/index.ts",
    },
    output: {
      format: "cjs",
      dir: "dist",
      minify: true,
      entryFileNames: "[name].cjs",
    },
    external: ["@ethan-utils/axios", "crypto-js"],
  },
]);
