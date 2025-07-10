import { defineConfig } from "rolldown";

export default defineConfig({
  input: {
    index: "./index.ts",
    "plugins/index": "./plugins/index.ts",
  },
  output: {
    format: "esm",
    dir: "dist",
    minify: true,
    entryFileNames: "[name].js",
  },
  external: ["axios", "axios-retry", "qs"],
});
