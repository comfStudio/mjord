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
  extends: ["eslint-config-universe/native", "@mjord/eslint-config-custom/base"]
    .map(require.resolve)
    .concat(["prettier"]),
  ignorePatterns: ["node_modules", "dist", ".expo/", "coverage/"],
  // add rules configurations here
  rules: {},
};
