import { defineConfig } from "rolldown";

export default defineConfig({
  input: {
    index: "./index.ts",
    "ltzf/index": "./ltzf/index.ts",
    "7pay/index": "./7pay/index.ts",
  },
  output: {
    format: "esm",
    dir: "dist",
    minify: true,
    entryFileNames: "[name].js",
  },
  external: ["@ethan-utils/axios", "crypto-js"],
});
