// @ts-check

import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import * as airbnb from "eslint-config-airbnb-typescript";
import * as eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...Object.fromEntries(
          Object.entries({
            ...globals.browser,
            ...globals.jest,
            // 여기에 InputDeviceInfo 수동 등록
            InputDeviceInfo: false,
          }).map(([key, value]) => [key.trim(), value])
        ),
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...airbnb.rules,
    },
  },
];
