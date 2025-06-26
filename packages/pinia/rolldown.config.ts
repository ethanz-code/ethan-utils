import { defineConfig } from "rolldown";

export default defineConfig({
  input: "./index.ts",
  output: {
    format: "esm",
    dir: "dist",
    minify: true,
  },
  external: ["pinia", "pinia-plugin-persistedstate", "zipson"],
});
