import { defineConfig } from "rolldown";

export default defineConfig([
  // ESM build
  {
    input: "./index.ts",
    output: {
      format: "esm",
      file: "dist/index.js",
      minify: true,
    },
    external: ["@ethan-utils/axios", "crypto-js"],
  },
  // CJS build
  {
    input: "./index.ts",
    output: {
      format: "cjs",
      file: "dist/index.cjs",
      minify: true,
    },
    external: ["@ethan-utils/axios", "crypto-js"],
  },
]);
