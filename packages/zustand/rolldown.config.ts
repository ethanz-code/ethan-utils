import { defineConfig } from "rolldown";

export default defineConfig({
  input: "./index.ts",
  output: {
    format: "esm",
    dir: "dist",
    minify: true,
  },
  external: ["zustand", "react", "immer"],
});
