import { defineConfig } from "rolldown";

export default defineConfig([
  // ESM build
  {
    input: {
      index: "./index.ts",
      "pay/ltzf": "./ltzf/index.ts",
      "pay/sevenPay": "./7pay/index.ts",
    },
    output: {
      format: "esm",
      dir: "dist",
      minify: true,
      entryFileNames: "[name].js",
      chunkFileNames: "chunks/[name]-[hash].js",
    },
    external: ["@ethan-utils/axios", "crypto-js"],
  },
  // CommonJS build
  {
    input: {
      index: "./index.ts",
      "pay/ltzf": "./ltzf/index.ts",
      "pay/sevenPay": "./7pay/index.ts",
    },
    output: {
      format: "cjs",
      dir: "dist",
      minify: true,
      entryFileNames: "[name].cjs",
      chunkFileNames: "chunks/[name]-[hash].cjs",
    },
    external: ["@ethan-utils/axios", "crypto-js"],
  },
]);
