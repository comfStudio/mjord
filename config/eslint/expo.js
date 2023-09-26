/* eslint-env node */
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
  extends: ["universe/native", "plugin:@tanstack/eslint-plugin-query/recommended", "@mjord/custom/base", "prettier"],
  ignorePatterns: ["node_modules", "dist", ".expo/", "coverage/"],
  plugins: ["react-hooks", "testing-library", "@tanstack/query"],
  overrides: [
    {
      // 3) Now we enable eslint-plugin-testing-library rules or preset only for matching testing files!
      files: ["**/__tests__/**/(*.)+(spec|test).[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  // add rules configurations here
  rules: {
    "testing-library/consistent-data-testid": [
      2,
      {
        testIdAttribute: ["testID"],
        testIdPattern: "^TestId(__[A-Z]*)?$",
      },
    ],
    "testing-library/prefer-user-event": "warn",
    "testing-library/prefer-wait-for": "off",
    "testing-library/no-wait-for-empty-callback": "off",
  },
};
