/* eslint-env node */
// eslint-disable @typescript-eslint/no-var-requires

const { resolve, join } = require("node:path");
const { existsSync } = require("node:fs");
const tsconfig = join(process.cwd(), "tsconfig.json");
const project = existsSync(tsconfig) ? resolve(process.cwd(), "tsconfig.json") : undefined;

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/**  @type {import("eslint-define-config").ESLintConfig} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "turbo",
    "prettier", // has to be last
  ],
  parserOptions: {
    project,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules", "dist", "coverage/"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
    "@typescript-eslint/no-var-requires": "warn",
  },
};
