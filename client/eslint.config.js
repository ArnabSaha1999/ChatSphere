import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
        {
          // Enforce single quotes
          quotes: ["error", "single", { avoidEscape: true }],

          // Enforce consistent indentation (2 spaces)
          indent: ["error", 2],

          // Require semicolons
          semi: ["error", "always"],

          // Disallow space before function parentheses
          "space-before-function-paren": ["error", "always"],

          // Enforce spacing inside curly braces
          "object-curly-spacing": ["error", "always"],

          // Disallow spacing inside array brackets
          "array-bracket-spacing": ["error", "always"],
        },
      ],
    },
  },
];
