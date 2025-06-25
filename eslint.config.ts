import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import pluginOxlint from "eslint-plugin-oxlint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const config: any = tseslint.config(
  globalIgnores([
    "**/dist/**",
    "**/node_modules/**",
    "./changeset/**",
    "pnpm-lock.yaml",
    "*.md",
  ]),
  tseslint.configs.recommended,
  eslintConfigPrettier,
  ...pluginOxlint.configs["flat/recommended"],
  {
    files: ["**/*.{js,ts,tsx,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "no-trailing-spaces": "error",
    },
  },
);

export default config;
