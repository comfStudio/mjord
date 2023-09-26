const { compilerOptions } = require("./tsconfig.json");
const path = require("node:path");

/**
 * Converts paths defined in tsconfig.json to the format of
 * moduleNameMapper in jest.config.js.
 *
 * For example, {'@alias/*': [ 'path/to/alias/*' ]}
 * Becomes {'@alias/(.*)': [ '<rootDir>/path/to/alias/$1' ]}
 *
 * @param {string} srcPath
 * @param {any} paths
 * @param {object} opts
 * @param {string} opts.monoRepoNamespace
 * @param {string} opts.monoRepoRoot
 */
function pathsToModuleNameMapper(srcPath, paths, opts) {
  const aliases = {};

  // Iterate over paths and convert them into moduleNameMapper format
  Object.keys(paths).forEach((item) => {
    let key = item.replace("/*", "/(.*)");

    if (!key.endsWith("/(.*)")) {
      key += "$";
    }

    let p = paths[item][0].replace("/*", "/$1");

    if (opts?.monoRepoNamespace) {
      const monoRepoRoot = opts?.monoRepoRoot ?? "../../";
      const monoRepoNamespace = opts.monoRepoNamespace;
      const monoRepoNamespaceRegex = new RegExp(`^${monoRepoNamespace}/`);
      if (key.match(monoRepoNamespaceRegex)) {
        // check if paths is relative
        if (p.startsWith(".")) {
          p = path.posix.join(monoRepoRoot, "node_modules", item.replace("/*", "/$1"));
        }
      }
    }
    aliases["^" + key] = srcPath + "/" + p;
  });
  return aliases;
}

const rootDir = "./";
const baseUrl = "<rootDir>";

const nodeModulesIgnorePatterns = [
  "((jest-)?react-native|@react-native(-community)?)",
  "expo(nent)?",
  "@expo(nent)?/.*",
  "@expo-google-fonts/.*",
  "react-navigation",
  "@react-navigation/.*",
  "@unimodules/.*",
  "unimodules",
  "sentry-expo",
  "native-base",
  "react-native-svg",
  "recoil",
];

/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  rootDir,
  transformIgnorePatterns: [`node_modules/(?!${nodeModulesIgnorePatterns.join("|")})`],
  testMatch: ["**/__tests__/**/(*.)+(spec|test).[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  setupFilesAfterEnv: ["./__tests__/setup.ts", "@testing-library/jest-native/extend-expect"],
  moduleDirectories: ["<rootDir>", "<rootDir>/node_modules", "<rootDir>/../../node_modules"],
  moduleNameMapper: {
    recoil: "recoil/native",
    ...pathsToModuleNameMapper(baseUrl, compilerOptions.paths, {
      monoRepoNamespace: "@mjord",
    }),
  },
  
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/__tests__/**",
    "!**/.*/**",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/*.config.js",
    "!**/*.json",
  ],
};
