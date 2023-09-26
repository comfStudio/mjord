/* eslint-env node */
/*
 * This is a custom ESLint configuration for use with
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/**  @type {import("eslint-define-config").ESLintConfig} */
module.exports = {
  extends: ["@mjord/eslint-config-custom/base"].map(require.resolve).concat(["prettier"]),
  globals: {
    React: true,
    JSX: true,
  },
  ignorePatterns: ["node_modules/", "dist/", "lib/", "coverage/"],
  plugins: ["react-hooks"],
  // add rules configurations here
  rules: {},
};
