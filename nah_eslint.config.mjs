import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      "no-unused-vars": "off", // Disable unused variables warning
      "@typescript-eslint/no-unused-vars": "off" // Disable TypeScript-specific rule
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-unused-vars": "off", // Disable unused variables warning
      "@typescript-eslint/no-unused-vars": "off" // Disable TypeScript-specific rule
    }
  },
  tseslint.configs.recommended
]);
