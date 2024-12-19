import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = {
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn", // 降為警告
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // 忽略前置底線的變數
  },
};

export default eslintConfig;
