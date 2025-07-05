import { defineConfig } from "rolldown";

export default defineConfig({
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
});
