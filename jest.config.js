import { createDefaultPreset, pathsToModuleNameMapper } from "ts-jest";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const tsconfig = require("./tsconfig.json");
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
const config = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Test Report",
      },
    ],
  ],

  // Maps TypeScript path aliases (e.g., "@/lib/...") to Jest-compatible module paths
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};

export default config;
